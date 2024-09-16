"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
const zod_1 = require("zod");
const updateProfileValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name cannot be an empty string').optional(),
        email: zod_1.z.string().email('Invalid email address').optional(),
        phone: zod_1.z.string().optional(),
        address: zod_1.z
            .string()
            .min(1, 'Address cannot be an empty string')
            .optional(),
    }),
});
const contactUsValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'You must provide your name!' })
            .min(1, { message: 'You must provide your name!' }),
        email: zod_1.z
            .string({ required_error: 'You must provide your email!' })
            .email({ message: 'Invalid email!' }),
        phone: zod_1.z
            .string({ required_error: 'You must provide your phone number!' })
            .min(1, { message: 'You must provide your phone number!' }),
        message: zod_1.z
            .string({ required_error: "Message can't be empty!" })
            .min(1, { message: "Message can't be empty!" })
            .max(1000, {
            message: "Message can't be longer than 1000 characters!",
        }),
    }),
});
exports.UserValidations = {
    updateProfileValidationSchema,
    contactUsValidationSchema,
};
