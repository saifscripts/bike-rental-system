import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RentalServices } from './rental.service';

// Route: /api/rentals (POST)
const createRental = catchAsync(async (req, res) => {
    const result = await RentalServices.createRentalIntoDB(req.user, req.body);
    sendResponse(res, result);
});

// Route: /api/rentals/:id/return (PUT)
const returnBike = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await RentalServices.returnBikeIntoDB(id);
    sendResponse(res, result);
});

// Route: /api/rentals (GET)
const getRentals = catchAsync(async (req, res) => {
    const result = await RentalServices.getRentalsFromDB(
        req.user.id,
        req.query,
    );
    sendResponse(res, result);
});

export const RentalControllers = {
    createRental,
    returnBike,
    getRentals,
};
