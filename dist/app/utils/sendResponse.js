"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    const { statusCode, message } = data;
    return res.status(statusCode).json({
        success: statusCode >= 200 && statusCode < 400,
        statusCode,
        message,
        data: data.data,
    });
};
exports.default = sendResponse;
