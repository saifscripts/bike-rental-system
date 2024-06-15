import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { Bike } from '../bike/bike.model';
import { IRental } from './rental.interface';
import { Rental } from './rental.model';

const createRentalIntoDB = async (
    decodedUser: JwtPayload,
    payload: Pick<IRental, 'userId' | 'bikeId' | 'startTime'>,
) => {
    const isBikeExists = await Bike.findById(payload.bikeId);

    if (!isBikeExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Bike not found!');
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        await Bike.findByIdAndUpdate(payload.bikeId, {
            isAvailable: false,
        });

        const newRental = Rental.create({ ...payload, userId: decodedUser.id });

        await session.commitTransaction();
        await session.endSession();
        return newRental;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

export const RentalServices = {
    createRentalIntoDB,
};
