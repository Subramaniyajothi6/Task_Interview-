import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import router from './routes/auth.js';
import { connectRedis } from './config/redis.js';


const app = express();

//  middleware

app.use(cors());
app.use(express.json());


connectDB();
connectRedis();

app.use('/api/auth',router);

app.listen(5000, () => console.log('Server running on port 5000'));