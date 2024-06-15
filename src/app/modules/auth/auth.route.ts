import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from '../user/user.validation';
import { AuthControllers } from './auth.controller';

const router = express.Router();

router.post(
    '/signup',
    validateRequest(UserValidations.signupValidationSchema),
    AuthControllers.signup,
);

export const AuthRoutes = router;
