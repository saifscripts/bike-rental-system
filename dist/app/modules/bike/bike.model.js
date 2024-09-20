"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bike = void 0;
const mongoose_1 = require("mongoose");
const BikeSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    cc: { type: Number, required: true },
    year: { type: Number, required: true },
    model: { type: String, required: true },
    brand: { type: String, required: true },
    imageURL: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
// Query Middleware
BikeSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
BikeSchema.pre('findOne', function (next) {
    if (this.getOptions().getDeletedDocs) {
        return next();
    }
    this.find({ isDeleted: { $ne: true } });
    next();
});
BikeSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
exports.Bike = (0, mongoose_1.model)('Bike', BikeSchema);
