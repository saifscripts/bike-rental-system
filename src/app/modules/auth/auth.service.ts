import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';

const signup = async (payload: IUser) => {
    const result = await User.create(payload);
    return result;
};

export const AuthServices = {
    signup,
};
