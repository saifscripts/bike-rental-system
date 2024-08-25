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
exports.UserValidations = {
    updateProfileValidationSchema,
};
