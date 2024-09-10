import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { Bike } from '../bike/bike.model';
import {
    generateTransactionId,
    initiatePayment,
} from '../payment/payment.utils';
import { User } from '../user/user.model';
import { RENTAL_STATUS } from './rental.constant';
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

    const paymentSession = await initiatePayment({
        txnId,
        amount: 100,
        successURL: `${config.base_url}/api/v1/payment/rental/success?TXNID=${txnId}`,
        failURL: `${config.base_url}/api/v1/payment/rental/fail?TXNID=${txnId}`,
        cancelURL: `${config.client_base_url}/bike/${payload.bikeId}`,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone,
        customerAddress: user.address,
    });

    if (!paymentSession?.result) {
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
        message: 'Rental created successfully',
        data: paymentSession,
    };
};

const returnBikeIntoDB = async (id: string) => {
    const rental = await Rental.findById(id);

    // check if the rental exists
    if (!rental) {
        throw new AppError(httpStatus.NOT_FOUND, 'Rental not found!');
    }

    // check if the bike is already returned
    if (rental.status === RENTAL_STATUS.PENDING) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "User didn't confirm this rental!",
        );
    }

    // check if the bike is already returned
    if (rental.status === RENTAL_STATUS.RETURNED) {
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

        const currentTime = new Date();

        // calculate cost and update relevant rental data
        const updatedRental = await Rental.findByIdAndUpdate(
            id,
            {
                returnTime: currentTime,
                totalCost: calculateTotalCost(
                    rental.startTime,
                    currentTime,
                    bike.pricePerHour,
                ),
                status: RENTAL_STATUS.RETURNED,
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

const getRentalsFromDB = async (userId: string) => {
    const rentals = await Rental.find({ userId });

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
    };
};

export const RentalServices = {
    createRentalIntoDB,
    returnBikeIntoDB,
    getRentalsFromDB,
};
