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
    .post((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.USER), (0, validateRequest_1.default)(rental_validation_1.RentalValidations.createRentalValidationSchema), rental_controller_1.RentalControllers.createRental)
    .get((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.USER), rental_controller_1.RentalControllers.getMyRentals);
router
    .route('/all')
    .get((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), rental_controller_1.RentalControllers.getAllRentals);
router
    .route('/:rentalId/return')
    .put((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), rental_controller_1.RentalControllers.returnBike);
router
    .route('/:rentalId/pay-remaining')
    .put((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.USER), (0, validateRequest_1.default)(rental_validation_1.RentalValidations.initiateRemainingPaymentValidationSchema), rental_controller_1.RentalControllers.initiateRemainingPayment);
exports.RentalRoutes = router;
