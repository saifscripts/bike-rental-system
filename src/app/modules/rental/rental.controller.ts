import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RentalServices } from './rental.service';

const createRental = catchAsync(async (req, res) => {
    const result = await RentalServices.createRentalIntoDB(req.user, req.body);
    sendResponse(res, result);
});

const returnBike = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await RentalServices.returnBikeIntoDB(id);
    sendResponse(res, result);
});

const getRentals = catchAsync(async (req, res) => {
    const { id } = req.user;
    const result = await RentalServices.getRentalsFromDB(id);
    sendResponse(res, result);
});

export const RentalControllers = {
    createRental,
    returnBike,
    getRentals,
};
