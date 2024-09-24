import { Schema, model } from 'mongoose';
import { ICoupon } from './coupon.interface';

const CouponSchema = new Schema<ICoupon>(
    {
        code: { type: String, required: true, unique: true },
        discountPercentage: { type: Number, required: true },
        isActive: { type: Boolean, required: true, default: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

// Query Middlewares
CouponSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

CouponSchema.pre('findOne', function (next) {
    if (this.getOptions().getDeletedDocs) {
        return next();
    }

    this.find({ isDeleted: { $ne: true } });
    next();
});

CouponSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});

export const Coupon = model<ICoupon>('Coupon', CouponSchema);
