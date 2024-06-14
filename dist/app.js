"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const app = (0, express_1.default)();
// parsers
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// test route
app.get('/', (_req, res) => {
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: 200,
        message: 'App is running successfully!',
    });
});
// not found route
app.use(notFound_1.default);
exports.default = app;
