import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { BikeControllers } from './bike.controller';
import { BikeValidations } from './bike.validation';

const router = express.Router();

router
    .route('/')
    .post(
        auth(USER_ROLE.ADMIN),
        validateRequest(BikeValidations.createBikeValidationSchema),
        BikeControllers.createBike,
    )
    .get(BikeControllers.getBikes);

router
    .route('/:id')
    .put(
        auth(USER_ROLE.ADMIN),
        validateRequest(BikeValidations.updateBikeValidationSchema),
        BikeControllers.updateBike,
    )
    .get(BikeControllers.getSingleBike)
    .delete(auth(USER_ROLE.ADMIN), BikeControllers.deleteBike);

export const BikeRoutes = router;
