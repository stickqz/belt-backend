import { db } from '../config/db.js';


export async function createTransaction(req, res) {
    try {
        console.log(req.body);
        const { title, amount, category, user_id } = req.body;

        if (!title || amount === undefined || !category || !user_id)
            return res.status(400).json({ error: 'All fields are required' });

        const ts = await db`
            INSERT INTO transactions (title, amount, category, user_id)
            VALUES (${title}, ${amount}, ${category}, ${user_id})
            RETURNING *
        `;

        console.log(ts);

        res.status(201).json(ts[0]);

    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export async function getTransactionById(req, res) {
    try {
        const { userId } = req.params;

        const ts = await db`
            SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
        `;

        res.status(200).json(ts);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export async function deleteTransaction(req, res) {
    try {
        const { id } = req.params;

        if (isNaN(parseInt(id)))
            return res.status(400).json({ error: 'Invalid transaction ID' });

        const result = await db`
            DELETE FROM transactions WHERE id = ${id}
        `;

        if (result.count === 0)
            return res.status(404).json({ error: 'Transaction not found' });

        res.status(204).json({ message: 'Transaction deleted successfully' });

    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export async function getTransactionSummary(req, res) {
    try {
        const { userId } = req.params;

        const balance = await db`SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}`;
        const income = await db`SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0`;
        const expenses = await db`SELECT COALESCE(SUM(amount), 0) AS expenses FROM transactions WHERE user_id = ${userId} AND amount < 0`;

        res.status(200).json({
            balance: balance[0].balance,
            income: income[0].income,
            expenses: expenses[0].expenses
        });


    } catch (error) {
        console.error('Error  getting the summary:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}