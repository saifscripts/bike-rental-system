import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builders/QueryBuilder';
import AppError from '../../errors/AppError';
import uploadImage from '../../utils/uploadImage';
import { BikeSearchableFields } from './bike.constant';
import { IBike } from './bike.interface';
import { Bike } from './bike.model';

const createBikeIntoDB = async (payload: IBike, image: { buffer: Buffer }) => {
    if (!image) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Image is required');
    }

    // use this id to upload image and create bike
    const _id = new mongoose.Types.ObjectId();

    const imageURL = await uploadImage(image.buffer, _id.toString(), 'bike');

    const newBike = await Bike.create({ ...payload, _id, imageURL });

    return {
        statusCode: httpStatus.CREATED,
        message: 'Bike added successfully',
        data: newBike,
    };
};

const getBikesFromDB = async (query: Record<string, unknown>) => {
    const bikeQuery = new QueryBuilder(Bike.find(), query)
        .search(BikeSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const bikes = await bikeQuery.modelQuery;
    const meta = await bikeQuery.countTotal();

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
        meta,
    };
};

const getSingleBikeFromDB = async (id: string) => {
    const bike = await Bike.findById(id);

    // check if the bike exist
    if (!bike) {
        throw new AppError(httpStatus.NOT_FOUND, 'Bike not found!');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Bike fetched successfully',
        data: bike,
    };
};

const updateBikeIntoDB = async (
    id: string,
    payload: Partial<IBike>,
    image?: { buffer: Buffer },
) => {
    const isBikeExists = await Bike.findById(id);

    if (!isBikeExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Bike not found!');
    }

    if (image) {
        const imageURL = (await uploadImage(
            image.buffer,
            id,
            'bike',
        )) as string;
        payload.imageURL = imageURL;
    }

    const updatedBike = await Bike.findByIdAndUpdate(id, payload, {
        new: true,
    });

    return {
        statusCode: httpStatus.OK,
        message: 'Bike updated successfully!',
        data: updatedBike,
    };
};

const deleteBikeFromDB = async (id: string) => {
    const bike = await Bike.findById(id);

    // check if the bike exists
    if (!bike) {
        throw new AppError(httpStatus.NOT_FOUND, 'Bike not found!');
    }

    // check if the bike is not available
    if (!bike.isAvailable) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Can't delete a bike that is currently being rented!",
        );
    }

    // delete the bike
    const deletedBike = await Bike.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
    );

    if (!deletedBike) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to delete bike',
        );
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Bike deleted successfully',
        data: deletedBike,
    };
};

export const BikeServices = {
    createBikeIntoDB,
    getBikesFromDB,
    getSingleBikeFromDB,
    updateBikeIntoDB,
    deleteBikeFromDB,
};
