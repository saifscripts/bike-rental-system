import mongoose from 'mongoose';

export interface IRental {
    userId: mongoose.Types.ObjectId;
    bikeId: mongoose.Types.ObjectId;
    startTime: Date;
    returnTime: Date;
    totalCost: number;
    isReturned: boolean;
}
