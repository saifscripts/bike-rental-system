import httpStatus from 'http-status';
import { IUser } from './user.interface';
import { User } from './user.model';

const getProfileFromDB = async (id: string) => {
    const user = await User.findById(id);

    return {
        statusCode: httpStatus.OK,
        message: 'User profile retrieved successfully',
        data: user,
    };
};

const updateProfileIntoDB = async (id: string, payload: Partial<IUser>) => {
    const updatedUser = await User.findByIdAndUpdate(id, payload, {
        new: true,
    });

    return {
        statusCode: httpStatus.OK,
        message: 'Profile updated successfully',
        data: updatedUser,
    };
};

export const UserServices = {
    getProfileFromDB,
    updateProfileIntoDB,
};
