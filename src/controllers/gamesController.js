import connection from "../db.js";

async function getGames(req, res) {
    const queryValue = req.query.name;

    try {
        if (queryValue !== undefined) {
            const result = await connection.query(
                `SELECT games.*, categories.name AS "categoryName" FROM games 
                    JOIN categories ON games."categoryId"=categories.id
                    WHERE games.name ILIKE $1
                `,
                [`${queryValue}%`]
            );
            res.status(200).send(result.rows);
        }

        const result = await connection.query(
            `SELECT games.*, categories.name AS "categoryName" FROM games 
                    JOIN categories ON games."categoryId"=categories.id`
        );
        res.status(200).send(result.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function createGame(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    try {
        const stockTotalNumber = Number(stockTotal);
        const pricePerDayNumber = Number(pricePerDay);

        if (stockTotalNumber <= 0 || pricePerDayNumber <= 0) {
            return res.sendStatus(400);
        }

        const result = await connection.query(
            `SELECT * FROM categories 
                WHERE id=$1`,
            [categoryId]
        );
        if (result.rowCount === 0) {
            return res.sendStatus(400);
        }

        await connection.query(
            `INSERT INTO games 
                (name, image, "stockTotal", "categoryId", "pricePerDay") 
                VALUES ($1,$2,$3,$4,$5)`,
            [name, image, stockTotalNumber, categoryId, pricePerDayNumber]
        );

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export { createGame, getGames };
