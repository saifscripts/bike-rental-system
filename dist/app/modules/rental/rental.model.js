"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rental = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const rental_constant_1 = require("./rental.constant");
const RentalSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    bikeId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Bike', required: true },
    txnId: { type: String, required: true, unique: true },
    finalTxnId: { type: String, unique: true },
    startTime: { type: Date, required: true },
    returnTime: { type: Date, default: null },
    totalCost: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    rentalStatus: {
        type: String,
        enum: rental_constant_1.RentalStatus,
        default: rental_constant_1.RENTAL_STATUS.PENDING,
    },
    paymentStatus: {
        type: String,
        enum: rental_constant_1.PaymentStatus,
        default: rental_constant_1.PAYMENT_STATUS.UNPAID,
    },
}, {
    timestamps: true,
});
RentalSchema.pre('find', function (next) {
    const query = this.getQuery();
    query.rentalStatus = { $ne: rental_constant_1.RENTAL_STATUS.PENDING };
    this.setQuery(query);
    next();
});
exports.Rental = mongoose_1.default.model('Rental', RentalSchema);
