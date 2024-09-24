import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
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

export const CouponServices = {
    createCouponIntoDB,
    getCouponsFromDB,
    getSingleCouponFromDB,
    updateCouponInDB,
    deleteCouponFromDB,
};
