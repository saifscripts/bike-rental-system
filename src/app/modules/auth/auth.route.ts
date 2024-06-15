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

router.post(
    '/login',
    validateRequest(UserValidations.loginValidationSchema),
    AuthControllers.login,
);

export const AuthRoutes = router;
