import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BikeServices } from './bike.service';

const createBike = catchAsync(async (req, res) => {
    const result = await BikeServices.createBikeIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'Bike added successfully',
        data: result,
    });
});

const getBikes = catchAsync(async (_req, res) => {
    const result = await BikeServices.getBikesFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Bikes retrieved successfully',
        data: result,
    });
});

export const BikeControllers = {
    createBike,
    getBikes,
};
