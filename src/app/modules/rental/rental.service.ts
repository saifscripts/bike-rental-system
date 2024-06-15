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

    if (!bike) {
        throw new AppError(httpStatus.NOT_FOUND, 'Bike not found!');
    }

    if (!bike.isAvailable) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Bike is not available right now!',
        );
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const newRental = await Rental.create({
            ...payload,
            userId: decodedUser.id,
        });

        await Bike.findByIdAndUpdate(payload.bikeId, {
            isAvailable: false,
        });

        await session.commitTransaction();
        await session.endSession();
        return newRental;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

const returnBikeIntoDB = async (id: string) => {
    const rental = await Rental.findById(id);

    if (!rental) {
        throw new AppError(httpStatus.NOT_FOUND, 'Rental not found!');
    }

    if (rental.isReturned) {
        throw new AppError(httpStatus.NOT_FOUND, 'Bike is already returned!');
    }

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

        await Bike.findByIdAndUpdate(rental.bikeId, {
            isAvailable: true,
        });

        await session.commitTransaction();
        await session.endSession();
        return updatedRental;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

const getRentalsFromDB = async (userId: string) => {
    const rentals = await Rental.find({ userId });
    return rentals;
};

export const RentalServices = {
    createRentalIntoDB,
    returnBikeIntoDB,
    getRentalsFromDB,
};
