"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const rental_controller_1 = require("./rental.controller");
const rental_validation_1 = require("./rental.validation");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(rental_validation_1.RentalValidations.createRentalValidationSchema), rental_controller_1.RentalControllers.createRental)
    .get((0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), rental_controller_1.RentalControllers.getRentals);
router
    .route('/:id/return')
    .put((0, auth_1.default)(user_constant_1.USER_ROLE.admin), rental_controller_1.RentalControllers.returnBike);
exports.RentalRoutes = router;
