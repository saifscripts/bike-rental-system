import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RentalServices } from './rental.service';

const createRental = catchAsync(async (req, res) => {
    const result = await RentalServices.createRentalIntoDB(req.user, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'Rental created successfully',
        data: result,
    });
});

const returnBike = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await RentalServices.returnBikeIntoDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Bike returned successfully',
        data: result,
    });
});

const getRentals = catchAsync(async (req, res) => {
    const { id } = req.user;
    const responseData = await RentalServices.getRentalsFromDB(id);
    sendResponse(res, responseData);
});

export const RentalControllers = {
    createRental,
    returnBike,
    getRentals,
};
