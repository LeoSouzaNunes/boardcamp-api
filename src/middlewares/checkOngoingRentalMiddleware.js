import connection from "../db.js";

export default async function checkOngoingRental(req, res, next) {
    const { id } = req.params;

    try {
        const result = await connection.query(
            `
                SELECT * FROM rentals
                    WHERE id=$1
            `,
            [id]
        );
        if (result.rowCount === 0) {
            return res.sendStatus(404);
        }
        if (result.rows[0].returnDate !== null) {
            return res.sendStatus(400);
        }
        next();
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
