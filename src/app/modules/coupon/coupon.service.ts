import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { ICoupon } from './coupon.interface';
import { Coupon } from './coupon.model';

const createCouponIntoDB = async (payload: ICoupon) => {
    const coupon = await Coupon.create(payload);

    return {
        statusCode: httpStatus.CREATED,
        message: 'Coupon created successfully',
        data: coupon,
    };
};

const getCouponsFromDB = async () => {
    const coupons = await Coupon.find();

    if (coupons.length === 0) {
        throw new AppError(httpStatus.NOT_FOUND, 'No coupons found');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Coupons fetched successfully',
        data: coupons,
    };
};

const getActiveCouponsFromDB = async () => {
    const coupons = await Coupon.find({ isActive: true });

    if (coupons.length === 0) {
        throw new AppError(httpStatus.NOT_FOUND, 'No coupons found');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Coupons fetched successfully',
        data: coupons,
    };
};

const getSingleCouponFromDB = async (id: string) => {
    const coupon = await Coupon.findById(id);

    if (!coupon) {
        throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Coupon fetched successfully',
        data: coupon,
    };
};

const updateCouponInDB = async (id: string, payload: ICoupon) => {
    const coupon = await Coupon.findByIdAndUpdate(id, payload, {
        new: true,
    });

    if (!coupon) {
        throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Coupon updated successfully',
        data: coupon,
    };
};

const deleteCouponFromDB = async (id: string) => {
    const coupon = await Coupon.findById(id);

    if (!coupon) {
        throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
    }

    const deletedCoupon = await Coupon.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
    );

    if (!deletedCoupon) {
        throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Coupon deleted successfully',
        data: deletedCoupon,
    };
};

// assign coupon to user by spinning the wheel
const spinWheelAndAssignCouponToUser = async (userId: string) => {
    const user = await User.findById(userId).populate('wonCoupon');

    // Check if user has already spun
    if (user?.wonCoupon) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'You have already won a coupon. Please use it first.',
        );
    }

    // Get all active coupons
    const activeCoupons = await Coupon.find({ isActive: true });

    if (!activeCoupons.length) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'No active coupons available.',
        );
    }

    // Randomly pick a coupon
    const randomIndex = Math.floor(Math.random() * activeCoupons.length);
    const selectedCoupon = activeCoupons[randomIndex];

    // Update the user's wonCoupon field
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { wonCoupon: selectedCoupon._id },
        { new: true },
    ).populate('wonCoupon');

    if (!updatedUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Coupon assigned successfully',
        data: updatedUser,
    };
};

export const CouponServices = {
    createCouponIntoDB,
    getCouponsFromDB,
    getActiveCouponsFromDB,
    getSingleCouponFromDB,
    updateCouponInDB,
    deleteCouponFromDB,
    spinWheelAndAssignCouponToUser,
};
