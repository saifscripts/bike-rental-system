import express from 'express';
import { PaymentControllers } from './payment.controller';

const router = express.Router();

router.route('/confirm-rental').post(PaymentControllers.confirmRental);
router.route('/complete-rental').post(PaymentControllers.completeRental);

export const PaymentRoutes = router;
