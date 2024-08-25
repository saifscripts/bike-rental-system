import { z } from 'zod';
import { UserRoles } from '../user/user.constant';

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

const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({
            required_error: 'Refresh token is required',
        }),
    }),
});

export const AuthValidations = {
    signupValidationSchema,
    loginValidationSchema,
    refreshTokenValidationSchema,
};