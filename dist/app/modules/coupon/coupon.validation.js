"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponValidations = void 0;
const zod_1 = require("zod");
const createCouponValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        code: zod_1.z
            .string({ required_error: 'Coupon code is required' })
            .trim()
            .toUpperCase()
            .min(1, {
            message: 'Coupon code is required',
        }),
        discountPercentage: zod_1.z
            .number({
            required_error: 'Discount percentage is required',
        })
            .min(0, {
            message: 'Discount percentage must be greater than 0',
        })
            .max(100, {
            message: 'Discount percentage must be less than 100',
        }),
    }),
});
const updateCouponValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        code: zod_1.z
            .string({ required_error: 'Coupon code is required' })
            .trim()
            .toUpperCase()
            .min(1, {
            message: 'Coupon code is required',
        })
            .optional(),
        discountPercentage: zod_1.z
            .number({
            required_error: 'Discount percentage is required',
        })
            .min(0, {
            message: 'Discount percentage must be greater than 0',
        })
            .max(100, {
            message: 'Discount percentage must be less than 100',
        })
            .optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.CouponValidations = {
    createCouponValidationSchema,
    updateCouponValidationSchema,
};
