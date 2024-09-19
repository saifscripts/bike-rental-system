import httpStatus from 'http-status';
import QueryBuilder from '../../builders/QueryBuilder';
import config from '../../config';
import AppError from '../../errors/AppError';
import { sendMail } from '../../utils/sendMail';
import uploadImage from '../../utils/uploadImage';
import { CONTACT_FORM_MESSAGE, USER_ROLE } from './user.constant';
import { IContactUsOptions, IUser } from './user.interface';
import { User } from './user.model';

const getUsersFromDB = async (query: Record<string, unknown>) => {
    const userQuery = new QueryBuilder(User.find(), query)
        // .search(UserSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const users = await userQuery.modelQuery;
    const meta = await userQuery.countTotal();

    // check if retrieved data is empty
    if (!users.length) {
        return {
            statusCode: httpStatus.NOT_FOUND,
            message: 'No Data Found',
            data: [],
        };
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Users retrieved successfully',
        data: users,
        meta,
    };
};

const deleteUserFromDB = async (id: string) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const result = await User.deleteOne({ _id: id });

    return {
        statusCode: httpStatus.OK,
        message: 'User deleted successfully',
        data: result,
    };
};

const makeAdminIntoDB = async (id: string) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const result = await User.findByIdAndUpdate(id, { role: USER_ROLE.ADMIN });

    return {
        statusCode: httpStatus.OK,
        message: 'User role updated successfully!',
        data: result,
    };
};

const removeAdminFromDB = async (id: string) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const result = await User.findByIdAndUpdate(id, { role: USER_ROLE.USER });

    return {
        statusCode: httpStatus.OK,
        message: 'User role updated successfully!',
        data: result,
    };
};

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

const contactUsViaMail = async (payload: IContactUsOptions) => {
    const emailBody = CONTACT_FORM_MESSAGE.replace('{{name}}', payload.name)
        .replace('{{email}}', payload.email)
        .replace('{{phone}}', payload.phone)
        .replace('{{message}}', payload.message);

    const result = await sendMail({
        from: payload.email,
        to: config.mail_auth_user!,
        subject: payload.name,
        html: emailBody,
    });

    if (!result.messageId) {
        throw new AppError(
            httpStatus.SERVICE_UNAVAILABLE,
            'Fail to send email!',
        );
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Email sent successfully',
        data: null,
    };
};

const updateAvatar = async (id: string, filepath: string) => {
    const { secure_url } = await uploadImage(filepath, id, 'avatar');

    const updatedUser = await User.findByIdAndUpdate(
        id,
        { avatarURL: secure_url },
        {
            new: true,
        },
    );

    return {
        statusCode: httpStatus.OK,
        message: 'Profile updated successfully',
        data: updatedUser,
    };
};

export const UserServices = {
    getUsersFromDB,
    deleteUserFromDB,
    makeAdminIntoDB,
    removeAdminFromDB,
    getProfileFromDB,
    updateProfileIntoDB,
    contactUsViaMail,
    updateAvatar,
};
