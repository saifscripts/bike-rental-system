"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotalCost = void 0;
const calculateTotalCost = (startTime, returnTime, pricePerHour) => {
    const startTimeInMilliseconds = new Date(startTime).getTime();
    const returnTimeInMilliseconds = new Date(returnTime).getTime();
    const totalMilliseconds = returnTimeInMilliseconds - startTimeInMilliseconds;
    const totalHours = totalMilliseconds / (1000 * 60 * 60);
    const totalCost = (totalHours * pricePerHour).toFixed(2);
    return Number(totalCost);
};
exports.calculateTotalCost = calculateTotalCost;
