import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CouponServices } from './coupon.service';

// Route: /api/v1/coupons (POST)
const createCoupon = catchAsync(async (req, res) => {
    const result = await CouponServices.createCouponIntoDB(req.body);
    sendResponse(res, result);
});

// Route: /api/v1/coupons (GET)
const getCoupons = catchAsync(async (_req, res) => {
    const result = await CouponServices.getCouponsFromDB();
    sendResponse(res, result);
});

// Route: /api/v1/coupons/:id (GET)
const getSingleCoupon = catchAsync(async (req, res) => {
    const result = await CouponServices.getSingleCouponFromDB(req.params.id);
    sendResponse(res, result);
});

// Route: /api/v1/coupons/:id (PUT)
const updateCoupon = catchAsync(async (req, res) => {
    const result = await CouponServices.updateCouponInDB(
        req.params.id,
        req.body,
    );
    sendResponse(res, result);
});

// Route: /api/v1/coupons/:id (DELETE)
const deleteCoupon = catchAsync(async (req, res) => {
    const result = await CouponServices.deleteCouponFromDB(req.params.id);
    sendResponse(res, result);
});

export const CouponControllers = {
    createCoupon,
    getCoupons,
    getSingleCoupon,
    updateCoupon,
    deleteCoupon,
};
