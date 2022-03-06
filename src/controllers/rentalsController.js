import connection from "../db.js";
import dayjs from "dayjs";
import checkValidId from "../utils/checkValidId.js";
import isGameAvailable from "../utils/isGameAvailable.js";
import buildRentalsObject from "../utils/buildRentalsObject.js";
import calculateDelayFee from "../utils/calculateDelayFee.js";

async function getRentals(req, res) {
    let query = ``;
    const customerId = req.query.customerId;
    const gameId = req.query.gameId;

    const validCustomerId = await checkValidId(customerId, "customers");
    const validGameId = await checkValidId(gameId, "games");

    if (validCustomerId) {
        query = `WHERE c.id = ${customerId}`;
    } else if (validGameId) {
        query = `WHERE g.id= ${gameId}`;
    } else if (validCustomerId && validGameId) {
        query = `WHERE c.id = ${customerId} AND g.id=${gameId}`;
    }

    try {
        const result = await connection.query({
            text: `
                SELECT r.*, c.id, c.name, g.id, g.name, g."categoryId", ct.name
                    FROM rentals r
                        JOIN customers c ON r."customerId"= c.id
                        JOIN games g ON r."gameId"=g.id
                        JOIN categories ct ON g."categoryId" = ct.id
                        ${query}
            `,
            rowMode: "array",
        });

        const rentals = buildRentalsObject(result.rows);
        res.send(rentals);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function createRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    let rental;

    try {
        const validCustomerId = await checkValidId(customerId, "customers");
        const validGameId = await checkValidId(gameId, "games");

        if (!validCustomerId || !validGameId) {
            return res.sendStatus(400);
        }

        const isAvailable = await isGameAvailable(gameId);

        if (!isAvailable) {
            return res.sendStatus(400);
        }

        const price = await connection.query(
            `
            SELECT "pricePerDay" FROM games
                WHERE id=$1
        `,
            [gameId]
        );

        rental = {
            ...req.body,
            rentDate: dayjs().format("YYYY-MM-DD"),
            originalPrice: daysRented * price.rows[0].pricePerDay,
            returnDate: null,
            delayFee: null,
        };
        await connection.query(
            `
            INSERT INTO rentals
                ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee")
                VALUES ($1,$2,$3,$4,$5,$6,$7)
        `,
            [
                customerId,
                gameId,
                daysRented,
                rental.rentDate,
                rental.originalPrice,
                rental.returnDate,
                rental.delayFee,
            ]
        );
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function returnRental(req, res) {
    const { id } = req.params;

    try {
        const result = await connection.query(
            `
            SELECT * FROM rentals
                WHERE id=$1
        `,
            [id]
        );

        const initialDate = result.rows[0].rentDate;
        const returnDate = dayjs().format("YYYY-MM-DD");
        const daysRented = result.rows[0].daysRented;
        const originalPrice = result.rows[0].originalPrice;

        const delayFee = calculateDelayFee(
            initialDate,
            returnDate,
            daysRented,
            originalPrice
        );
        console.log(returnDate, delayFee);
        await connection.query(
            `UPDATE rentals SET "returnDate"=$2, "delayFee"=$3
                WHERE id=$1
           `,
            [id, returnDate, delayFee]
        );
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function deleteRental(req, res) {
    const { id } = req.params;
    try {
        await connection.query(
            `
            DELETE FROM rentals
                WHERE id=$1
        `,
            [id]
        );

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export { getRentals, createRental, returnRental, deleteRental };
