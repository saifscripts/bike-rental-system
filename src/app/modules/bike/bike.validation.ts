import { z } from 'zod';

const createBikeValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'Name is required',
            })
            .min(1, 'Name must be at least 1 character long'),
        description: z
            .string({
                required_error: 'Description is required',
            })
            .min(1, 'Description must be at least 1 character long'),
        pricePerHour: z
            .number({
                required_error: 'Price per hour is required',
            })
            .positive('Price per hour must be a positive number'),
        cc: z
            .number({
                required_error: 'CC is required',
            })
            .positive('CC must be a positive number'),
        year: z.number({
            required_error: 'Year is required',
        }),
        model: z
            .string({
                required_error: 'Model is required',
            })
            .min(1, 'Model must be at least 1 character long'),
        brand: z
            .string({
                required_error: 'Brand is required',
            })
            .min(1, 'Brand must be at least 1 character long'),
    }),
});

export const BikeValidations = {
    createBikeValidationSchema,
};
