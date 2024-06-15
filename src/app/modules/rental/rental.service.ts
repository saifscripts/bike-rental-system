import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { Bike } from '../bike/bike.model';
import { IRental } from './rental.interface';
import { Rental } from './rental.model';
import { calculateTotalCost } from './rental.util';

const createRentalIntoDB = async (
    decodedUser: JwtPayload,
    payload: Pick<IRental, 'userId' | 'bikeId' | 'startTime'>,
) => {
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

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // create new rental with payload and decoded userId
        const newRental = await Rental.create({
            ...payload,
            userId: decodedUser.id,
        });

        // update bike availability status to false
        await Bike.findByIdAndUpdate(payload.bikeId, {
            isAvailable: false,
        });

        // commit transaction and end session
        await session.commitTransaction();
        await session.endSession();

        // return response
        return {
            statusCode: httpStatus.CREATED,
            message: 'Rental created successfully',
            data: newRental,
        };
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

const returnBikeIntoDB = async (id: string) => {
    const rental = await Rental.findById(id);

    // check if the rental exists
    if (!rental) {
        throw new AppError(httpStatus.NOT_FOUND, 'Rental not found!');
    }

    // check if the bike is already returned
    if (rental.isReturned) {
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
                isReturned: true,
            },
            {
                new: true,
            },
        );

        // update bike availability status to true
        await Bike.findByIdAndUpdate(rental.bikeId, {
            isAvailable: true,
        });

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
