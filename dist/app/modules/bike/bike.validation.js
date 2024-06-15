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
            .min(1, 'Name must be at least 1 character long'),
        description: zod_1.z
            .string({
            required_error: 'Description is required',
        })
            .min(1, 'Description must be at least 1 character long'),
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
            .min(1, 'Model must be at least 1 character long'),
        brand: zod_1.z
            .string({
            required_error: 'Brand is required',
        })
            .min(1, 'Brand must be at least 1 character long'),
    }),
});
exports.BikeValidations = {
    createBikeValidationSchema,
};
