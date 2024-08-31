import { Schema, model } from 'mongoose';
import { IBike } from './bike.interface';

const BikeSchema = new Schema<IBike>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        pricePerHour: { type: Number, required: true },
        isAvailable: { type: Boolean, default: true },
        cc: { type: String, required: true },
        year: { type: String, required: true },
        model: { type: String, required: true },
        brand: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);

export const Bike = model<IBike>('Bike', BikeSchema);
