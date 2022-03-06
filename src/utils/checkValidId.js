import connection from "../db.js";

export default async function checkValidId(id, table) {
    try {
        const result = await connection.query(
            `
            SELECT * FROM ${table}
                WHERE id=$1
        `,
            [id]
        );

        if (result.rowCount === 0) {
            return false;
        }
        return true;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}
