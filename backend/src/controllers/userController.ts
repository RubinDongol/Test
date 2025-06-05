import { Request, Response } from "express";
import pool from "../config/db";

// Follow a user
export const followUser = async (req: Request, res: Response) => {
  const follower = (req as any).user;
  const followingId = parseInt(req.params.id, 10);

  if (follower.id === followingId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  try {
    await pool.query(
      `INSERT INTO follows (follower_id, following_id)
       VALUES ($1, $2)
       ON CONFLICT (follower_id, following_id) DO NOTHING`,
      [follower.id, followingId]
    );

    res.status(200).json({ message: "User followed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to follow user" });
  }
};

// Unfollow a user
export const unfollowUser = async (req: Request, res: Response) => {
  const follower = (req as any).user;
  const followingId = parseInt(req.params.id, 10);

  try {
    await pool.query(
      `DELETE FROM follows WHERE follower_id = $1 AND following_id = $2`,
      [follower.id, followingId]
    );

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to unfollow user" });
  }
};
