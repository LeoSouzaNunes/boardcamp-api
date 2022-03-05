import connection from "../db.js";

export default function checkUniqueDataMiddleware(table, data) {
    return async (req, res, next) => {
        const result = await connection.query(
            `SELECT * FROM ${table} 
                WHERE ${data}=$1`,
            [req.body[`${data}`]]
        );
        if (result.rowCount !== 0) {
            return res.sendStatus(409);
        }
        next();
    };
}
