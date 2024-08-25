import { z } from 'zod';

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
    updateProfileValidationSchema,
};
