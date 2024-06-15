import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controllar';

const router = express.Router();

router
    .route('/me')
    .get(auth(USER_ROLE.admin, USER_ROLE.user), UserControllers.getProfile);

export const UserRoutes = router;
