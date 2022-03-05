import connection from "../db.js";

async function getCustomers(req, res) {
    const queryValue = req.query.cpf;

    try {
        if (queryValue !== undefined) {
            const result = await connection.query(
                `
                SELECT * FROM customers
                    WHERE cpf LIKE $1
           `,
                [`${queryValue}%`]
            );

            return res.status(200).send(result.rows);
        }
        const result = await connection.query(`
            SELECT * FROM customers
        `);

        res.status(200).send(result.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function getCustomer(req, res) {
    const { id } = req.params;
    try {
        const result = await connection.query(
            `
            SELECT * FROM customers
                WHERE id = $1
        `,
            [id]
        );
        if (result.rowCount === 0) {
            return res.sendStatus(404);
        }

        res.send(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function createCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    try {
        await connection.query(
            `
            INSERT INTO customers (name, phone, cpf, birthday) 
                VALUES ($1, $2, $3, $4)
       `,
            [name, phone, cpf, birthday]
        );

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function updateCustomer(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;
    try {
        await connection.query(
            `
            UPDATE customers SET
                name=$1, phone=$2, cpf=$3, birthday=$4
            WHERE id=$5
        `,
            [name, phone, cpf, birthday, id]
        );
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export { getCustomers, getCustomer, createCustomer, updateCustomer };
