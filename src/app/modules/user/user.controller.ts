import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

// Route: /api/users/me (GET)
const getProfile = catchAsync(async (req, res) => {
    const { id } = req.user;
    const result = await UserServices.getProfileFromDB(id);
    sendResponse(res, result);
});

// Route: /api/users/me (PUT)
const updateProfile = catchAsync(async (req, res) => {
    const { id } = req.user;
    const result = await UserServices.updateProfileIntoDB(id, req.body);
    sendResponse(res, result);
});

export const UserControllers = {
    getProfile,
    updateProfile,
};
