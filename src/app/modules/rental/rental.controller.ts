import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RentalServices } from './rental.service';

// Route: /api/v1/rentals (POST)
const createRental = catchAsync(async (req, res) => {
    const result = await RentalServices.createRentalIntoDB(req.user, req.body);
    sendResponse(res, result);
});

// Route: /api/v1/rentals (GET)
const getMyRentals = catchAsync(async (req, res) => {
    const result = await RentalServices.getMyRentalsFromDB(
        req.user.id,
        req.query,
    );
    sendResponse(res, result);
});

// Route: /api/v1/rentals/all (GET)
const getAllRentals = catchAsync(async (req, res) => {
    const result = await RentalServices.getAllRentalsFromDB(req.query);
    sendResponse(res, result);
});

// Route: /api/v1/rentals/:rentalId/return (PUT)
const returnBike = catchAsync(async (req, res) => {
    const result = await RentalServices.returnBikeIntoDB(
        req.params.rentalId,
        req.body,
    );
    sendResponse(res, result);
});

// Route: /api/v1/rentals/:rentalId/pay-remaining (PUT)
const initiateRemainingPayment = catchAsync(async (req, res) => {
    const result = await RentalServices.initiateRemainingPayment(
        req.params.rentalId,
    );
    sendResponse(res, result);
});

export const RentalControllers = {
    createRental,
    initiateRemainingPayment,
    returnBike,
    getMyRentals,
    getAllRentals,
};
