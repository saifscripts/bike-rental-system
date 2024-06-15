import { z } from 'zod';
import { UserRoles } from './user.constant';

const signupValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'Name is required',
            })
            .min(1, 'Name cannot be an empty string'),
        email: z
            .string({
                required_error: 'Email is required',
            })
            .email('Invalid email address'),
        password: z
            .string({
                required_error: 'Password is required',
            })
            .min(6, 'Password must be at least 6 characters long'),
        phone: z.string({
            required_error: 'Phone number is required',
        }),
        address: z
            .string({
                required_error: 'Address is required',
            })
            .min(1, 'Address cannot be an empty string'),
        role: z.enum(UserRoles, {
            required_error: 'Role is required!',
            invalid_type_error: "Role must be 'admin' or 'user'",
        }),
    }),
});

const loginValidationSchema = z.object({
    body: z.object({
        email: z
            .string({
                required_error: 'Email is required',
            })
            .email('Invalid email address'),
        password: z
            .string({
                required_error: 'Password is required',
            })
            .min(6, 'Password must be at least 6 characters long'),
    }),
});

const updateProfileValidationSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name cannot be an empty string').optional(),
        email: z.string().email('Invalid email address').optional(),
        phone: z.string().optional(),
        address: z
            .string()
            .min(1, 'Address cannot be an empty string')
            .optional(),
    }),
});

export const UserValidations = {
    signupValidationSchema,
    loginValidationSchema,
    updateProfileValidationSchema,
};
