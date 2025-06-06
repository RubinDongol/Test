// backend/src/controllers/notificationController.ts
import { Request, Response } from "express";
import pool from "../config/db";

// @desc Get notifications for a user (who liked their posts)
export const getNotifications = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    const result = await pool.query(
      `
      SELECT 
        l.id as like_id,
        l.created_at as liked_at,
        u.id as user_id,
        u.full_name,
        u.photo,
        p.id as post_id,
        p.content,
        'like' as type
      FROM likes l
      JOIN users u ON l.user_id = u.id
      JOIN posts p ON l.post_id = p.id
      WHERE p.user_id = $1 AND l.user_id != $1
      ORDER BY l.created_at DESC
      LIMIT 20
      `,
      [user.id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("getNotifications error:", err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// @desc Mark notifications as read (optional for future use)
export const markNotificationsAsRead = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { notificationIds } = req.body;

  try {
    // For now, we'll just return success since we don't have a read status in the schema
    // You can extend this later by adding a notifications table
    res.status(200).json({ message: "Notifications marked as read" });
  } catch (err) {
    console.error("markNotificationsAsRead error:", err);
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
};
