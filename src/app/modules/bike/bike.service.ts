import { IBike } from './bike.interface';
import { Bike } from './bike.model';

const createBikeIntoDB = async (payload: IBike) => {
    const newBike = await Bike.create(payload);
    return newBike;
};

export const BikeServices = {
    createBikeIntoDB,
};
