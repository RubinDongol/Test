// /middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import pool from "../config/db";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

      // const userResult = await pool.query("SELECT id, full_name, email FROM users WHERE id = $1", [decoded.id]);
      const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [decoded.id]);
      (req as any).user = userResult.rows[0];

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
