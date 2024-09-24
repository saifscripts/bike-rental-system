import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { CouponControllers } from './coupon.controller';
import { CouponValidations } from './coupon.validation';

const router = express.Router();

router
    .route('/')
    .post(
        auth(USER_ROLE.ADMIN),
        validateRequest(CouponValidations.createCouponValidationSchema),
        CouponControllers.createCoupon,
    )
    .get(auth(USER_ROLE.ADMIN), CouponControllers.getCoupons);

router
    .route('/:id')
    .get(auth(USER_ROLE.ADMIN), CouponControllers.getSingleCoupon)
    .put(
        auth(USER_ROLE.ADMIN),
        validateRequest(CouponValidations.updateCouponValidationSchema),
        CouponControllers.updateCoupon,
    )
    .delete(auth(USER_ROLE.ADMIN), CouponControllers.deleteCoupon);

export const CouponRoutes = router;
