import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controller';
import { UserValidations } from './user.validation';

const router = express.Router();

router
    .route('/me')
    .get(auth(USER_ROLE.admin, USER_ROLE.user), UserControllers.getProfile)
    .put(
        validateRequest(UserValidations.updateProfileValidationSchema),
        auth(USER_ROLE.admin, USER_ROLE.user),
        UserControllers.updateProfile,
    );

export const UserRoutes = router;
