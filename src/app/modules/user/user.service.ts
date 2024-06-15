import { IUser } from './user.interface';
import { User } from './user.model';

const getProfileFromDB = async (id: string) => {
    const user = await User.findById(id);
    return user;
};

const updateProfileIntoDB = async (id: string, payload: Partial<IUser>) => {
    const updatedUser = await User.findByIdAndUpdate(id, payload, {
        new: true,
    });

    return updatedUser;
};

export const UserServices = {
    getProfileFromDB,
    updateProfileIntoDB,
};
