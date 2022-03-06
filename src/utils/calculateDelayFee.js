import dayjs from "dayjs";

export default function calculateDelayFee(
    initialDate,
    returnDate,
    daysRented,
    originalPrice
) {
    const gamePrice = originalPrice / daysRented;
    const diffInDays = dayjs(returnDate).diff(initialDate, "day");
    const diff = diffInDays - daysRented;

    if (diff > 0) {
        return diff * gamePrice;
    }
    return 0;
}
