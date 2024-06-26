"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("./user.constant");
const signupValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: 'Name is required',
        })
            .min(1, 'Name cannot be an empty string'),
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email('Invalid email address'),
        password: zod_1.z
            .string({
            required_error: 'Password is required',
        })
            .min(6, 'Password must be at least 6 characters long'),
        phone: zod_1.z.string({
            required_error: 'Phone number is required',
        }),
        address: zod_1.z
            .string({
            required_error: 'Address is required',
        })
            .min(1, 'Address cannot be an empty string'),
        role: zod_1.z.enum(user_constant_1.UserRoles, {
            required_error: 'Role is required!',
            invalid_type_error: "Role must be 'admin' or 'user'",
        }),
    }),
});
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email('Invalid email address'),
        password: zod_1.z
            .string({
            required_error: 'Password is required',
        })
            .min(6, 'Password must be at least 6 characters long'),
    }),
});
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
exports.UserValidations = {
    signupValidationSchema,
    loginValidationSchema,
    updateProfileValidationSchema,
};
