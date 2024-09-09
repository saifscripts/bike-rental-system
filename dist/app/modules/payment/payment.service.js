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
exports.PaymentServices = void 0;
const fs_1 = require("fs");
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = require("path");
const config_1 = __importDefault(require("../../config"));
const bike_model_1 = require("../bike/bike.model");
const rental_model_1 = require("../rental/rental.model");
const payment_utils_1 = require("./payment.utils");
const confirmRental = (txnId) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyResponse = yield (0, payment_utils_1.verifyPayment)(txnId);
    if (verifyResponse && verifyResponse.pay_status === 'Successful') {
        const session = yield mongoose_1.default.startSession();
        try {
            session.startTransaction();
            // confirm rental
            const rental = yield rental_model_1.Rental.findOneAndUpdate({ txnId }, {
                isConfirmed: true,
            }, { new: true, session });
            // update bike availability
            yield bike_model_1.Bike.findByIdAndUpdate(rental === null || rental === void 0 ? void 0 : rental.bikeId, { isAvailable: false }, { session });
            yield session.commitTransaction();
            yield session.endSession();
            const filePath = (0, path_1.join)(__dirname + '/success.html');
            const successTemplate = (0, fs_1.readFileSync)(filePath, 'utf-8').replace('{{dashboard-link}}', `${config_1.default.client_base_url}/dashboard/bookings`);
            return successTemplate;
        }
        catch (_a) {
            yield session.abortTransaction();
            yield session.endSession();
            return 'Something went wrong!';
        }
    }
    if (verifyResponse && verifyResponse.pay_status === 'Failed') {
        const rental = yield rental_model_1.Rental.findOne({ txnId });
        const filePath = (0, path_1.join)(__dirname + '/fail.html');
        const failTemplate = (0, fs_1.readFileSync)(filePath, 'utf-8')
            .replace('{{retry-link}}', `${config_1.default.payment_base_url}/payment_page.php?track_id=${verifyResponse.pg_txnid}`)
            .replace('{{back-link}}', `${config_1.default.client_base_url}/bike/${rental === null || rental === void 0 ? void 0 : rental.bikeId}`);
        return failTemplate;
    }
    return 'Something went wrong!';
});
exports.PaymentServices = {
    confirmRental,
};
