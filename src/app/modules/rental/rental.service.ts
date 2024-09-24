import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import QueryBuilder from '../../builders/QueryBuilder';
import config from '../../config';
import AppError from '../../errors/AppError';
import { Bike } from '../bike/bike.model';
import {
    generateTransactionId,
    initiatePayment,
} from '../payment/payment.utils';
import { User } from '../user/user.model';
import { PAYMENT_STATUS, RENTAL_STATUS } from './rental.constant';
import { IRental } from './rental.interface';
import { Rental } from './rental.model';
import { calculateTotalCost } from './rental.util';

const createRentalIntoDB = async (
    decodedUser: JwtPayload,
    payload: Pick<IRental, 'userId' | 'bikeId' | 'startTime'>,
) => {
    const userId = decodedUser.id;

    const user = await User.findById(userId);

    // check if the user exists
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const bike = await Bike.findById(payload.bikeId);

    // check if the bike exists
    if (!bike) {
        throw new AppError(httpStatus.NOT_FOUND, 'Bike not found!');
    }

    // check if the bike is available right now
    if (!bike.isAvailable) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Bike is not available right now!',
        );
    }

    const txnId = generateTransactionId();

    const paymentResponse = await initiatePayment({
        txnId,
        amount: 100,
        successURL: `${config.base_url}/api/v1/payment/confirm-rental?TXNID=${txnId}`,
        failURL: `${config.base_url}/api/v1/payment/confirm-rental?TXNID=${txnId}`,
        cancelURL: `${config.client_base_url}/bike/${payload.bikeId}`,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone,
        customerAddress: user.address,
    });

    if (!paymentResponse?.result) {
        throw new AppError(
            httpStatus.SERVICE_UNAVAILABLE,
            'Failed to initiate payment!',
        );
    }

    await Rental.create({
        ...payload,
        userId,
        txnId,
    });

    return {
        statusCode: httpStatus.CREATED,
        message: 'Rental initiated successfully',
        data: paymentResponse,
    };
};

const initiateRemainingPayment = async (rentalId: string) => {
    const rental = await Rental.findById(rentalId).populate('userId');

    // check if the rental exists
    if (!rental) {
        throw new AppError(httpStatus.NOT_FOUND, 'Rental not found!');
    }

    // check if the bike is returned
    if (rental.rentalStatus !== RENTAL_STATUS.RETURNED) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Bike is not returned yet!');
    }

    const user = await User.findById(rental.userId);

    // check if the rental exists
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const remainingAmount = rental.totalCost - rental.paidAmount;

    // check if the payment is already done
    if (remainingAmount <= 0) {
        // update relevant rental data
        const updatedRental = await Rental.findByIdAndUpdate(
            rentalId,
            {
                paidAmount: rental.totalCost,
                paymentStatus: PAYMENT_STATUS.PAID,
            },
            {
                new: true,
            },
        );

        if (!updatedRental) {
            throw new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                'Failed to update rental data!',
            );
        }

        return {
            statusCode: httpStatus.OK,
            message: `Payment already done. You will get a refund of ${-remainingAmount} taka`,
            data: updatedRental,
        };
    }

    const txnId = generateTransactionId();

    const paymentResponse = await initiatePayment({
        txnId,
        amount: remainingAmount,
        successURL: `${config.base_url}/api/v1/payment/complete-rental?TXNID=${txnId}`,
        failURL: `${config.base_url}/api/v1/payment/complete-rental?TXNID=${txnId}`,
        cancelURL: `${config.client_base_url}/dashboard/my-rentals`,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone,
        customerAddress: user.address,
    });

    if (!paymentResponse?.result) {
        throw new AppError(
            httpStatus.SERVICE_UNAVAILABLE,
            'Failed to initiate payment!',
        );
    }

    await Rental.findByIdAndUpdate(rentalId, {
        finalTxnId: txnId,
    });

    return {
        statusCode: httpStatus.OK,
        message: 'Payment initiated successfully',
        data: paymentResponse,
    };
};

const returnBikeIntoDB = async (
    rentalId: string,
    payload: Pick<IRental, 'returnTime'>,
) => {
    const rental = await Rental.findById(rentalId);

    // check if the rental exists
    if (!rental) {
        throw new AppError(httpStatus.NOT_FOUND, 'Rental not found!');
    }

    // check if the bike is already returned
    if (rental.rentalStatus === RENTAL_STATUS.PENDING) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "User didn't confirm this rental!",
        );
    }

    // check if the bike is already returned
    if (rental.rentalStatus === RENTAL_STATUS.RETURNED) {
        throw new AppError(httpStatus.NOT_FOUND, 'Bike is already returned!');
    }

    // retrieve the bike data for updating rental data
    const bike = await Bike.findById(rental.bikeId);

    if (!bike) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Failed to retrieve the bike!',
        );
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const totalCost = calculateTotalCost(
            rental.startTime,
            payload.returnTime,
            Number(bike.pricePerHour),
        );

        // update relevant rental data
        const updatedRental = await Rental.findByIdAndUpdate(
            rentalId,
            {
                returnTime: payload.returnTime,
                rentalStatus: RENTAL_STATUS.RETURNED,
                totalCost,
            },
            {
                new: true,
                session,
            },
        );

        // update bike availability status to true
        await Bike.findByIdAndUpdate(
            rental.bikeId,
            {
                isAvailable: true,
            },
            { session },
        );

        // commit transaction and end session
        await session.commitTransaction();
        await session.endSession();

        // return response
        return {
            statusCode: httpStatus.OK,
            message: 'Bike returned successfully',
            data: updatedRental,
        };
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

const getMyRentalsFromDB = async (
    userId: string,
    query: Record<string, unknown>,
) => {
    const rentalQuery = new QueryBuilder(
        Rental.find({ userId }).populate('bikeId'),
        query,
    )
        .filter()
        .sort()
        .paginate()
        .fields();

    const rentals = await rentalQuery.modelQuery;
    const meta = await rentalQuery.countTotal();

    // check if retrieved data is empty
    if (!rentals.length) {
        return {
            statusCode: httpStatus.NOT_FOUND,
            message: 'No Data Found',
            data: [],
        };
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Rentals retrieved successfully',
        data: rentals,
        meta,
    };
};

const getAllRentalsFromDB = async (query: Record<string, unknown>) => {
    const rentalQuery = new QueryBuilder(
        Rental.find().populate('bikeId userId'),
        query,
    )
        .filter()
        .sort()
        .paginate()
        .fields();

    const rentals = await rentalQuery.modelQuery;
    const meta = await rentalQuery.countTotal();

    // check if retrieved data is empty
    if (!rentals.length) {
        return {
            statusCode: httpStatus.NOT_FOUND,
            message: 'No Data Found',
            data: [],
        };
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Rentals retrieved successfully',
        data: rentals,
        meta,
    };
};

export const RentalServices = {
    createRentalIntoDB,
    initiateRemainingPayment,
    returnBikeIntoDB,
    getMyRentalsFromDB,
    getAllRentalsFromDB,
};
