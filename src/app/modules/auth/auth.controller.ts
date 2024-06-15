import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const signup = catchAsync(async (req, res) => {
    const result = await AuthServices.signup(req.body);
    sendResponse(res, result);
});

const login = catchAsync(async (req, res) => {
    const result = await AuthServices.login(req.body);
    sendResponse(res, result);
});

export const AuthControllers = {
    signup,
    login,
};
