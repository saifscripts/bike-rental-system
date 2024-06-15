import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IBike } from './bike.interface';
import { Bike } from './bike.model';

const createBikeIntoDB = async (payload: IBike) => {
    const newBike = await Bike.create(payload);
    return newBike;
};

const getBikesFromDB = async () => {
    const bikes = await Bike.find();

    if (!bikes.length) {
        throw new AppError(httpStatus.NOT_FOUND, 'No Data Found');
    }

    return bikes;
};

const updateBikeIntoDB = async (id: string, payload: Partial<IBike>) => {
    const isBikeExists = await Bike.findById(id);

    if (!isBikeExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Bike not found!');
    }

    const updatedBike = await Bike.findByIdAndUpdate(id, payload, {
        new: true,
    });

    return updatedBike;
};

const deleteBikeFromDB = async (id: string) => {
    const isBikeExists = await Bike.findById(id);

    if (!isBikeExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Bike not found!');
    }

    const deletedBike = await Bike.findByIdAndDelete(id);
    return deletedBike;
};

export const BikeServices = {
    createBikeIntoDB,
    getBikesFromDB,
    updateBikeIntoDB,
    deleteBikeFromDB,
};
