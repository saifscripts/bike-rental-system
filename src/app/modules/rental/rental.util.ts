export const calculateTotalCost = (
    startTime: Date,
    returnTime: Date,
    pricePerHour: number,
): number => {
    const startTimeInMilliseconds = new Date(startTime).getTime();
    const returnTimeInMilliseconds = new Date(returnTime).getTime();

    const totalMilliseconds =
        returnTimeInMilliseconds - startTimeInMilliseconds;
    const totalHours = totalMilliseconds / (1000 * 60 * 60);
    const totalCost = (totalHours * pricePerHour).toFixed(2);

    return Number(totalCost);
};
