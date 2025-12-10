import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import router from './routes/auth.js';
import { connectRedis } from './config/redis.js';
import { mysqlPool } from "./config/mysql.js";
import dotenv from 'dotenv';
dotenv.config();


const app = express();


app.use(cors({
  origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("/*", cors());

app.use(express.json());

(async () => {
  try {
    await mysqlPool.getConnection();
    console.log("MySQL Connected");
  } catch (err) {
    console.error("MySQL Error:", err);
  }
})();

connectDB();
connectRedis();

app.use('/api/auth',router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));