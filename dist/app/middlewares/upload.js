"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingle = void 0;
const http_status_1 = __importDefault(require("http-status"));
const multer_1 = __importDefault(require("multer"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const uploadSingle = (fieldName) => {
    return (0, catchAsync_1.default)((req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const storage = multer_1.default.memoryStorage();
        const upload = (0, multer_1.default)({ storage: storage });
        const uploadMiddleware = upload.single(fieldName);
        uploadMiddleware(req, _res, (err) => {
            if (err) {
                new AppError_1.default(http_status_1.default.BAD_REQUEST, 'File upload failed');
            }
            if (!req.file) {
                new AppError_1.default(http_status_1.default.BAD_REQUEST, 'No file uploaded');
            }
            next();
        });
    }));
};
exports.uploadSingle = uploadSingle;
