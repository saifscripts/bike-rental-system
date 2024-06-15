import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const getProfile = catchAsync(async (req, res) => {
    const { id } = req.user;

    const result = await UserServices.getProfileFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'User profile retrieved successfully',
        data: result,
    });
});

const updateProfile = catchAsync(async (req, res) => {
    const { id } = req.user;

    const result = await UserServices.updateProfileIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Profile updated successfully',
        data: result,
    });
});

export const UserControllers = {
    getProfile,
    updateProfile,
};
