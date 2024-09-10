import { z } from 'zod';

const createRentalValidationSchema = z.object({
    body: z.object({
        bikeId: z.string({ required_error: 'Bike ID is required' }),
        startTime: z
            .string({ required_error: 'Start time is required' })
            .datetime({ offset: true }),
    }),
});

const returnBikeValidationSchema = z.object({
    body: z.object({
        returnTime: z
            .string({ required_error: 'Return time is required' })
            .datetime({ offset: true }),
    }),
});

export const RentalValidations = {
    createRentalValidationSchema,
    returnBikeValidationSchema,
};
