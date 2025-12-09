import jwt from "jsonwebtoken";
import { redisClient } from "../config/redis.js";



export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    if (!token)
      return res.json({ success: false, message: "No token provided" });


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    
    const sessionToken = await redisClient.get(`session:${userId}`);

    if (!sessionToken || sessionToken !== token)
      return res.json({ success: false, message: "Session expired. Login again." });

    req.userId = userId;
    next();

  } catch (err) {
    return res.json({ success: false, message: "Invalid Token" });
  }
};