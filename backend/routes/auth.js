import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { mysqlPool } from "../config/mysql.js";
import { redisClient } from "../config/redis.js";
import Profile from "../models/Profile.js";
import { authMiddleware } from "../middleware/auth.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.json({ success: false, message: "All fields are required" });

    const [exists] = await mysqlPool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (exists.length > 0)
      return res.json({ success: false, message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await mysqlPool.execute(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, hashed]
    );

    await Profile.create({ userId: result.insertId });

    res.json({ success: true, message: "Registered successfully" });
  } catch (err) {
  console.error("REGISTER ERROR:", err);
  res.json({ success: false, message: err.message });
}
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.json({ success: false, message: "All fields are required" });

    const [rows] = await mysqlPool.execute(
      "SELECT id, password_hash FROM users WHERE email = ?",
      [email]
    );
    if (rows.length === 0)
      return res.json({ success: false, message: "User not found" });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.json({ success: false, message: "Invalid password" });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await redisClient.set(`session:${user.id}`, token);

    res.json({
      success: true,
      message: "Login successful",
      token,
      userId: user.id
    });
  } catch (err) {
    res.json({ success: false, message: "Server error", error: err.message });
  }
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { age, dob, contact } = req.body;
    await Profile.findOneAndUpdate(
      { userId: req.userId },
      { age, dob, contact }
    );
    res.json({ success: true, message: "Profile updated" });
  } catch (err) {
    res.json({ success: false, message: "Update failed", error: err.message });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.userId });

    const [rows] = await mysqlPool.execute(
      "SELECT name, email FROM users WHERE id = ?",
      [req.userId]
    );

    if (!rows.length)
      return res.json({ success: false, message: "User not found", error: err.message });

    res.json({
      success: true,
      data: {
        name: rows[0].name,
        email: rows[0].email,
        age: profile ? profile.age : "",
        dob: profile ? profile.dob : "",
        contact: profile ? profile.contact : ""
      }
    });
  } catch (err) {
    res.json({ success: false, message: "Error fetching profile", error: err.message });
  }
});


export default router;


