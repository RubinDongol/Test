import { Request, Response } from "express";
import pool from "../config/db";

// @desc Create a new post
export const createPost = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Post content is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *`,
      [user.id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

// @desc Get all posts (For You feed)
export const getAllPosts = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    const result = await pool.query(
      `
      SELECT 
        p.*, 
        u.full_name, 
        u.photo,
        COALESCE(l.like_count, 0)::int AS like_count,
        COALESCE(c.comment_count, 0)::int AS comment_count,
        EXISTS (
          SELECT 1 FROM bookmarks b WHERE b.post_id = p.id AND b.user_id = $1
        ) AS is_bookmarked,
        EXISTS (
          SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = $1
        ) AS is_liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS like_count
        FROM likes
        GROUP BY post_id
      ) l ON l.post_id = p.id
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS comment_count
        FROM comments
        GROUP BY post_id
      ) c ON c.post_id = p.id
      ORDER BY p.created_at DESC
      `,
      [user.id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("getAllPosts error:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};



export const toggleLikePost = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const postId = parseInt(req.params.id, 10);

  if (!postId) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    const existing = await pool.query(
      "SELECT * FROM likes WHERE user_id = $1 AND post_id = $2",
      [user.id, postId]
    );

    if (existing.rows.length > 0) {
      // Already liked → unlike
      await pool.query(
        "DELETE FROM likes WHERE user_id = $1 AND post_id = $2",
        [user.id, postId]
      );
      return res.status(200).json({ liked: false, message: "Post unliked" });
    } else {
      // Not liked → like it
      await pool.query(
        "INSERT INTO likes (user_id, post_id) VALUES ($1, $2)",
        [user.id, postId]
      );
      return res.status(200).json({ liked: true, message: "Post liked" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Like action failed" });
  }
};

// Add a comment to a post
export const addComment = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const postId = parseInt(req.params.id, 10);
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO comments (user_id, post_id, text)
       VALUES ($1, $2, $3) RETURNING *`,
      [user.id, postId, text]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// Get all comments for a post
export const getCommentsByPostId = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id, 10);

  try {
    const result = await pool.query(
      `SELECT c.*, u.full_name, u.photo
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = $1
       ORDER BY c.created_at ASC`,
      [postId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

// Toggle bookmark for a post
export const toggleBookmarkPost = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const postId = parseInt(req.params.id, 10);

  if (!postId) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    const existing = await pool.query(
      "SELECT * FROM bookmarks WHERE user_id = $1 AND post_id = $2",
      [user.id, postId]
    );

    if (existing.rows.length > 0) {
      // Unbookmark it
      await pool.query(
        "DELETE FROM bookmarks WHERE user_id = $1 AND post_id = $2",
        [user.id, postId]
      );
      return res.status(200).json({ bookmarked: false, message: "Post unbookmarked" });
    } else {
      // Bookmark it
      await pool.query(
        "INSERT INTO bookmarks (user_id, post_id) VALUES ($1, $2)",
        [user.id, postId]
      );
      return res.status(200).json({ bookmarked: true, message: "Post bookmarked" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Bookmark action failed" });
  }
};

// @desc Get all posts by a specific user
export const getBookmarkedPosts = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    const result = await pool.query(
      `
      SELECT 
        p.*, 
        u.full_name, 
        u.photo,
        COALESCE(l.like_count, 0)::int AS like_count,
        COALESCE(c.comment_count, 0)::int AS comment_count,
        TRUE AS is_bookmarked,
        EXISTS (
          SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = $1
        ) AS is_liked
      FROM bookmarks b
      JOIN posts p ON b.post_id = p.id
      JOIN users u ON p.user_id = u.id
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS like_count
        FROM likes
        GROUP BY post_id
      ) l ON l.post_id = p.id
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS comment_count
        FROM comments
        GROUP BY post_id
      ) c ON c.post_id = p.id
      WHERE b.user_id = $1
      ORDER BY p.created_at DESC
      `,
      [user.id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("getBookmarkedPosts error:", err);
    res.status(500).json({ message: "Failed to fetch bookmarked posts" });
  }
};

// @desc Get all posts by a specific user
export const getFollowingPosts = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    const result = await pool.query(
      `
      SELECT 
        p.*, 
        u.full_name, 
        u.photo,
        COALESCE(l.like_count, 0)::int AS like_count,
        COALESCE(c.comment_count, 0)::int AS comment_count,
        EXISTS (
          SELECT 1 FROM bookmarks b WHERE b.post_id = p.id AND b.user_id = $1
        ) AS is_bookmarked,
        EXISTS (
          SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = $1
        ) AS is_liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS like_count
        FROM likes
        GROUP BY post_id
      ) l ON l.post_id = p.id
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS comment_count
        FROM comments
        GROUP BY post_id
      ) c ON c.post_id = p.id
      WHERE p.user_id IN (
        SELECT following_id FROM follows WHERE follower_id = $1
      )
      ORDER BY p.created_at DESC
      `,
      [user.id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("getFollowingPosts error:", err);
    res.status(500).json({ message: "Failed to fetch following posts" });
  }
};
