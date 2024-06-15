import { z } from 'zod';
import { UserRoles } from './user.constant';

export const signupValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'Name is required',
            })
            .min(1, 'Name must be at least 1 character long'),
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
            .min(1, 'Address must be at least 1 character long'),
        role: z.enum(UserRoles, {
            required_error: 'Role is required!',
            invalid_type_error: "Role must be 'admin' or 'user'",
        }),
    }),
});

export const UserValidations = {
    signupValidationSchema,
};
