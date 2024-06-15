import mongoose, { Schema } from 'mongoose';
import { IRental } from './rental.interface';

const RentalSchema: Schema = new Schema<IRental>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bikeId: { type: Schema.Types.ObjectId, ref: 'Bike', required: true },
    startTime: { type: Date, required: true },
    returnTime: { type: Date, default: null },
    totalCost: { type: Number, default: 0 },
    isReturned: { type: Boolean, default: false },
});

export const Rental = mongoose.model<IRental>('Rental', RentalSchema);
