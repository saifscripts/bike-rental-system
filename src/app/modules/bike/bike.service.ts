import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IBike } from './bike.interface';
import { Bike } from './bike.model';

const createBikeIntoDB = async (payload: IBike) => {
    const newBike = await Bike.create(payload);

    return {
        statusCode: httpStatus.CREATED,
        message: 'Bike added successfully',
        data: newBike,
    };
};

const getBikesFromDB = async () => {
    const bikes = await Bike.find();

    // check if retrieved data is empty
    if (!bikes.length) {
        return {
            statusCode: httpStatus.NOT_FOUND,
            message: 'No Data Found',
            data: [],
        };
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Bikes retrieved successfully',
        data: bikes,
    };
};

const updateBikeIntoDB = async (id: string, payload: Partial<IBike>) => {
    const isBikeExists = await Bike.findById(id);

    // check if the bike exist
    if (!isBikeExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Bike not found!');
    }

    // check if the bike exists
    const updatedBike = await Bike.findByIdAndUpdate(id, payload, {
        new: true,
    });

    return {
        statusCode: httpStatus.OK,
        message: 'Bike updated successfully',
        data: updatedBike,
    };
};

const deleteBikeFromDB = async (id: string) => {
    const isBikeExists = await Bike.findById(id);

    // check if the bike exists
    if (!isBikeExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Bike not found!');
    }

    // delete the bike
    const deletedBike = await Bike.findByIdAndDelete(id);

    return {
        statusCode: httpStatus.OK,
        message: 'Bike deleted successfully',
        data: deletedBike,
    };
};

export const BikeServices = {
    createBikeIntoDB,
    getBikesFromDB,
    updateBikeIntoDB,
    deleteBikeFromDB,
};
