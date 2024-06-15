import { User } from './user.model';

const getProfileFromDB = async (id: string) => {
    const user = await User.findById(id);
    return user;
};

export const UserServices = {
    getProfileFromDB,
};
