import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2";

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  port: process.env.MYSQL_PORT,
  ssl: { rejectUnauthorized: false }
});

connection.connect((err) => {
  if (err) {
    console.error("MySQL Error:", err);
    return;
  }
  console.log("MySQL Connected");
});
