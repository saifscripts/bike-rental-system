"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: ['http://localhost:5173', 'https://bikelagbe.vercel.app'],
    credentials: true,
};
// parsers
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// routes
app.use('/api/v1', routes_1.default);
// test route
app.get('/', (_req, res) => {
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: 200,
        message: 'App is running successfully!',
    });
});
// globalError handler
app.use(globalErrorHandler_1.default);
// not found route
app.use(notFound_1.default);
exports.default = app;
