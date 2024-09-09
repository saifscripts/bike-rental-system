"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const router = express_1.default.Router();
router.route('/rental/success').post(payment_controller_1.PaymentControllers.confirmRental);
router.route('/rental/fail').post(payment_controller_1.PaymentControllers.confirmRental);
exports.PaymentRoutes = router;
