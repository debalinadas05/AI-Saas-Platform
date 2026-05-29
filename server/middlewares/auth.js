import jwt from "jsonwebtoken";
import sql from "../config/db.js";

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [user] = await sql`
      SELECT id, name, email, plan, free_usage FROM users WHERE id = ${decoded.userId}
    `;

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.userId = user.id;
    req.plan = user.plan || "free";
    req.free_usage = user.free_usage || 0;

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};