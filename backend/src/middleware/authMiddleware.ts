// /middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import pool from "../config/db";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: number;
      };

      const userResult = await pool.query(
        "SELECT id, full_name AS name, email, role_id FROM users WHERE id = $1",
        [decoded.id]
      );

      if (userResult.rows.length === 0) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      // Attach user object to req
      (req as any).user = userResult.rows[0];

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
