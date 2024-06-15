import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const signup = catchAsync(async (req, res) => {
    const result = await AuthServices.signup(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'User registered successfully',
        data: result,
    });
});

export const AuthControllers = {
    signup,
};
