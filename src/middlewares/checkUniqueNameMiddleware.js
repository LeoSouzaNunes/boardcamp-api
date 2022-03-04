import connection from "../db.js";

export default function checkUniqueNameMiddleware(table) {
    return async (req, res, next) => {
        const result = await connection.query(
            `SELECT * FROM ${table} 
                WHERE name=$1`,
            [req.body.name]
        );
        if (result.rowCount !== 0) {
            return res.sendStatus(409);
        }
        next();
    };
}
