import { z } from 'zod';

const createBikeValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'Name is required',
            })
            .min(1, 'Name cannot be an empty string'),
        description: z
            .string({
                required_error: 'Description is required',
            })
            .min(1, 'Description cannot be an empty string'),
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
            .min(1, 'Model cannot be an empty string'),
        brand: z
            .string({
                required_error: 'Brand is required',
            })
            .min(1, 'Brand cannot be an empty string'),
    }),
});

const updateBikeValidationSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name cannot be an empty string').optional(),
        description: z
            .string()
            .min(1, 'Description cannot be an empty string')
            .optional(),
        pricePerHour: z
            .number()
            .positive('Price per hour must be a positive number')
            .optional(),
        cc: z.number().positive('CC must be a positive number').optional(),
        year: z.number().optional(),
        model: z.string().min(1, 'Model cannot be an empty string').optional(),
        brand: z.string().min(1, 'Brand cannot be an empty string').optional(),
    }),
});

export const BikeValidations = {
    createBikeValidationSchema,
    updateBikeValidationSchema,
};
