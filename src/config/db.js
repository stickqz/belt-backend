import {neon} from '@neondatabase/serverless'
import 'dotenv/config'

export const db = neon(process.env.DATABASE_URL)

export async function initDB() {
    try {
        await db`CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            category VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`

        console.log('Database initialized successfully');
    }
    catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}
