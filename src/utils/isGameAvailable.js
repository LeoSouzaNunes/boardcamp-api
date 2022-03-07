import connection from "../db.js";

export default async function isGameAvailable(gameId) {
    try {
        const gamesInStock = await connection.query(
            `
            SELECT "stockTotal" FROM games
                WHERE id=$1
        `,
            [gameId]
        );

        const rentalsNumber = await connection.query(
            `
            SELECT * FROM rentals
                WHERE "returnDate" IS NULL AND "gameId"=$1
        `,
            [gameId]
        );
        if (rentalsNumber.rowCount >= gamesInStock.rows[0].stockTotal) {
            return false;
        }
        return true;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}
