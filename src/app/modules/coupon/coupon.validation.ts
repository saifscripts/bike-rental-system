import { z } from 'zod';

const createCouponValidationSchema = z.object({
    body: z.object({
        code: z
            .string({ required_error: 'Coupon code is required' })
            .trim()
            .toUpperCase()
            .min(1, {
                message: 'Coupon code is required',
            }),
        discountPercentage: z
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

const updateCouponValidationSchema = z.object({
    body: z.object({
        code: z
            .string({ required_error: 'Coupon code is required' })
            .trim()
            .toUpperCase()
            .min(1, {
                message: 'Coupon code is required',
            })
            .optional(),
        discountPercentage: z
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
        isActive: z.boolean().optional(),
    }),
});

export const CouponValidations = {
    createCouponValidationSchema,
    updateCouponValidationSchema,
};
