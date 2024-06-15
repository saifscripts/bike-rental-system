"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BikeValidations = void 0;
const zod_1 = require("zod");
const createBikeValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: 'Name is required',
        })
            .min(1, 'Name cannot be an empty string'),
        description: zod_1.z
            .string({
            required_error: 'Description is required',
        })
            .min(1, 'Description cannot be an empty string'),
        pricePerHour: zod_1.z
            .number({
            required_error: 'Price per hour is required',
        })
            .positive('Price per hour must be a positive number'),
        cc: zod_1.z
            .number({
            required_error: 'CC is required',
        })
            .positive('CC must be a positive number'),
        year: zod_1.z.number({
            required_error: 'Year is required',
        }),
        model: zod_1.z
            .string({
            required_error: 'Model is required',
        })
            .min(1, 'Model cannot be an empty string'),
        brand: zod_1.z
            .string({
            required_error: 'Brand is required',
        })
            .min(1, 'Brand cannot be an empty string'),
    }),
});
const updateBikeValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name cannot be an empty string').optional(),
        description: zod_1.z
            .string()
            .min(1, 'Description cannot be an empty string')
            .optional(),
        pricePerHour: zod_1.z
            .number()
            .positive('Price per hour must be a positive number')
            .optional(),
        cc: zod_1.z.number().positive('CC must be a positive number').optional(),
        year: zod_1.z.number().optional(),
        model: zod_1.z.string().min(1, 'Model cannot be an empty string').optional(),
        brand: zod_1.z.string().min(1, 'Brand cannot be an empty string').optional(),
    }),
});
exports.BikeValidations = {
    createBikeValidationSchema,
    updateBikeValidationSchema,
};
