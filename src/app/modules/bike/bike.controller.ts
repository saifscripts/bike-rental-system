import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BikeServices } from './bike.service';

// Route: /api/bikes (POST)
const createBike = catchAsync(async (req, res) => {
    const result = await BikeServices.createBikeIntoDB(req.body);
    sendResponse(res, result);
});

// Route: /api/bikes (GET)
const getBikes = catchAsync(async (req, res) => {
    const result = await BikeServices.getBikesFromDB(req.query);
    sendResponse(res, result);
});

// Route: /api/bikes/:id (GET)
const getSingleBike = catchAsync(async (req, res) => {
    const result = await BikeServices.getSingleBikeFromDB(req.params.id);
    sendResponse(res, result);
});

// Route: /api/bikes/:id (PUT)
const updateBike = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await BikeServices.updateBikeIntoDB(id, req.body);
    sendResponse(res, result);
});

// Route: /api/bikes/:id (DELETE)
const deleteBike = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await BikeServices.deleteBikeFromDB(id);
    sendResponse(res, result);
});

export const BikeControllers = {
    createBike,
    getBikes,
    getSingleBike,
    updateBike,
    deleteBike,
};
