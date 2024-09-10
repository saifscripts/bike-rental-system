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
        auth(USER_ROLE.ADMIN, USER_ROLE.USER),
        validateRequest(RentalValidations.createRentalValidationSchema),
        RentalControllers.createRental,
    )
    .get(auth(USER_ROLE.ADMIN, USER_ROLE.USER), RentalControllers.getRentals);

router
    .route('/:rentalId/return')
    .put(auth(USER_ROLE.ADMIN), RentalControllers.returnBike);

router
    .route('/:rentalId/pay-remaining')
    .put(
        auth(USER_ROLE.ADMIN, USER_ROLE.USER),
        RentalControllers.initiateRemainingPayment,
    );

export const RentalRoutes = router;
