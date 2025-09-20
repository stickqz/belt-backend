import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js';
import job from './config/cron.js';


dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(rateLimiter);
app.use(express.json());


if (process.env.NODE_ENV === 'production')
    job.start();


app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'API is running' });
});


app.use('/api/transactions', transactionsRoute);


initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

