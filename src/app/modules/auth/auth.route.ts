import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthControllers } from './auth.controller';
import { AuthValidations } from './auth.validation';

const router = express.Router();

router.post(
    '/signup',
    validateRequest(AuthValidations.signupValidationSchema),
    AuthControllers.signup,
);

router.post(
    '/login',
    validateRequest(AuthValidations.loginValidationSchema),
    AuthControllers.login,
);

router.post(
    '/refresh-token',
    validateRequest(AuthValidations.refreshTokenValidationSchema),
    AuthControllers.refreshToken,
);

export const AuthRoutes = router;
