import mongoose, { Schema } from 'mongoose';
import {
    PAYMENT_STATUS,
    PaymentStatus,
    RENTAL_STATUS,
    RentalStatus,
} from './rental.constant';
import { IRental } from './rental.interface';

const RentalSchema: Schema = new Schema<IRental>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        bikeId: { type: Schema.Types.ObjectId, ref: 'Bike', required: true },
        txnId: { type: String, required: true, unique: true },
        finalTxnId: { type: String },
        startTime: { type: Date, required: true },
        returnTime: { type: Date, default: null },
        totalCost: { type: Number, default: 0 },
        paidAmount: { type: Number, default: 0 },
        rentalStatus: {
            type: String,
            enum: RentalStatus,
            default: RENTAL_STATUS.PENDING,
        },
        paymentStatus: {
            type: String,
            enum: PaymentStatus,
            default: PAYMENT_STATUS.UNPAID,
        },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

// Query Middleware
RentalSchema.pre('find', function (next) {
    const query = this.getQuery();
    query.rentalStatus = { $ne: RENTAL_STATUS.PENDING };
    query.isDeleted = { $ne: true };
    this.setQuery(query);
    next();
});

export const Rental = mongoose.model<IRental>('Rental', RentalSchema);
