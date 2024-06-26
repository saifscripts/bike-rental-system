import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { RentalControllers } from './rental.controller';
import { RentalValidations } from './rental.validation';

const router = express.Router();

router
    .route('/')
    .post(
        auth(USER_ROLE.admin, USER_ROLE.user),
        validateRequest(RentalValidations.createRentalValidationSchema),
        RentalControllers.createRental,
    )
    .get(auth(USER_ROLE.admin, USER_ROLE.user), RentalControllers.getRentals);

router
    .route('/:id/return')
    .put(auth(USER_ROLE.admin), RentalControllers.returnBike);

export const RentalRoutes = router;
