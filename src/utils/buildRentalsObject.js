export default function buildRentalsObject(array) {
    try {
        const rentals = array?.map((row) => {
            const [
                id,
                customerId,
                gameId,
                rentDate,
                daysRented,
                returnDate,
                originalPrice,
                delayFee,
                customerNum,
                customerName,
                gameNum,
                gameName,
                catNum,
                catName,
            ] = row;

            return {
                id,
                customerId,
                gameId,
                rentDate,
                daysRented,
                returnDate,
                originalPrice,
                delayFee,
                customer: {
                    id: customerNum,
                    name: customerName,
                },
                game: {
                    id: gameNum,
                    name: gameName,
                    categoryId: catNum,
                    categoryName: catName,
                },
            };
        });
        return rentals;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}
