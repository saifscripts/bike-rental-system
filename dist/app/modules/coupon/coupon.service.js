"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const coupon_model_1 = require("./coupon.model");
const createCouponIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.Coupon.create(payload);
    return {
        statusCode: http_status_1.default.CREATED,
        message: 'Coupon created successfully',
        data: coupon,
    };
});
const getCouponsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const coupons = yield coupon_model_1.Coupon.find();
    if (coupons.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No coupons found');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Coupons fetched successfully',
        data: coupons,
    };
});
const getActiveCouponsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const coupons = yield coupon_model_1.Coupon.find({ isActive: true });
    if (coupons.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No coupons found');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Coupons fetched successfully',
        data: coupons,
    };
});
const getSingleCouponFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.Coupon.findById(id);
    if (!coupon) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Coupon not found');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Coupon fetched successfully',
        data: coupon,
    };
});
const updateCouponInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.Coupon.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!coupon) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Coupon not found');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Coupon updated successfully',
        data: coupon,
    };
});
const deleteCouponFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.Coupon.findById(id);
    if (!coupon) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Coupon not found');
    }
    const deletedCoupon = yield coupon_model_1.Coupon.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!deletedCoupon) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Coupon not found');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Coupon deleted successfully',
        data: deletedCoupon,
    };
});
// assign coupon to user by spinning the wheel
const spinWheelAndAssignCouponToUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).populate('wonCoupon');
    // Check if user has already spun
    if (user === null || user === void 0 ? void 0 : user.wonCoupon) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'You have already won a coupon. Please use it first.');
    }
    // Get all active coupons
    const activeCoupons = yield coupon_model_1.Coupon.find({ isActive: true });
    if (!activeCoupons.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No active coupons available.');
    }
    // Randomly pick a coupon
    const randomIndex = Math.floor(Math.random() * activeCoupons.length);
    const selectedCoupon = activeCoupons[randomIndex];
    // Update the user's wonCoupon field
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, { wonCoupon: selectedCoupon._id }, { new: true }).populate('wonCoupon');
    if (!updatedUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Coupon assigned successfully',
        data: updatedUser,
    };
});
exports.CouponServices = {
    createCouponIntoDB,
    getCouponsFromDB,
    getActiveCouponsFromDB,
    getSingleCouponFromDB,
    updateCouponInDB,
    deleteCouponFromDB,
    spinWheelAndAssignCouponToUser,
};
