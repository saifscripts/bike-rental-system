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

export const BikeServices = {
    createBikeIntoDB,
    getBikesFromDB,
};
