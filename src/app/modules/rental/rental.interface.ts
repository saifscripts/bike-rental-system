import mongoose from 'mongoose';
import { PAYMENT_STATUS, RENTAL_STATUS } from './rental.constant';

export interface IRental {
    userId: mongoose.Types.ObjectId;
    bikeId: mongoose.Types.ObjectId;
    txnId: string;
    startTime: Date;
    returnTime: Date;
    totalCost: number;
    status: keyof typeof RENTAL_STATUS;
    paymentStatus: keyof typeof PAYMENT_STATUS;
}
