import connection from "../db.js";

async function getCategories(req, res) {
    try {
        const result = await connection.query("SELECT * FROM categories");

        res.status(200).send(result.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function createCategory(req, res) {
    const { name } = req.body;

    try {
        await connection.query(
            `INSERT INTO categories (name)
                VALUES ($1)`,
            [name]
        );

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export { getCategories, createCategory };
