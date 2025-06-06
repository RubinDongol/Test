import { Request, Response } from "express";
import { nanoid } from "nanoid";
import pool from "../config/db";

// Create Cooking Class
export const createCookingClass = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const {
    title,
    description,
    price,
    duration,
    class_date,
    class_time,
    max_students,
    difficulty,
    learn,
    requirements,
    category,
    tags,
    chef_notes,
    course_fee,
    image,
  } = req.body;

  const slug = nanoid(12); // generates something like 'nvyYjxnGjyPZ'
  const live_link = `http://localhost:5173/live-classes/${slug}`;

  try {
    const result = await pool.query(
      `INSERT INTO cooking_classes (
        user_id, title, description, price, duration, class_date, class_time,
        max_students, difficulty, learn, requirements,
        category, tags, chef_notes, course_fee, image, live_link
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11,
        $12, $13, $14, $15, $16, $17
      ) RETURNING *`,
      [
        user.id,
        title,
        description,
        price,
        duration,
        class_date,
        class_time,
        max_students,
        difficulty,
        learn,
        requirements,
        category,
        tags,
        chef_notes,
        course_fee,
        image,
        live_link,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("createCookingClass error:", err);
    res.status(500).json({ message: "Failed to create cooking class" });
  }
};

// Get all Cooking Classes
export const getCookingClasses = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT
         cc.*,
         u.full_name,
         u.photo,
         ROUND(AVG(r.rating), 1) AS stars,
         COUNT(r.*) AS review_count
       FROM cooking_classes cc
       JOIN users u ON cc.user_id = u.id
       LEFT JOIN cooking_class_reviews r ON cc.id = r.class_id
       GROUP BY cc.id, u.id
       ORDER BY cc.class_date ASC`
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("getCookingClasses error:", err);
    res.status(500).json({ message: "Failed to fetch classes" });
  }
};

// Delete Cooking Class
export const deleteCookingClass = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const classId = parseInt(req.params.id, 10);

  try {
    const classResult = await pool.query(
      `SELECT * FROM cooking_classes WHERE id = $1 AND user_id = $2`,
      [classId, user.id]
    );

    if (classResult.rowCount === 0) {
      return res
        .status(403)
        .json({ message: "Unauthorized or class not found" });
    }

    await pool.query(`DELETE FROM cooking_classes WHERE id = $1`, [classId]);
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (err) {
    console.error("deleteCookingClass error:", err);
    res.status(500).json({ message: "Failed to delete class" });
  }
};

// Get a single Cooking Class by ID
export const getCookingClassById = async (req: Request, res: Response) => {
  const classId = parseInt(req.params.id, 10);

  try {
    const result = await pool.query(
      `SELECT
         cc.*,
         u.full_name,
         u.photo,
         ROUND(AVG(r.rating), 1) AS stars,
         COUNT(r.*) AS review_count
       FROM cooking_classes cc
       JOIN users u ON cc.user_id = u.id
       LEFT JOIN cooking_class_reviews r ON cc.id = r.class_id
       WHERE cc.id = $1
       GROUP BY cc.id, u.id`,
      [classId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Cooking class not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("getCookingClassById error:", err);
    res.status(500).json({ message: "Failed to fetch class detail" });
  }
};

export const rateCookingClass = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const classId = parseInt(req.params.id, 10);
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const existing = await pool.query(
      `SELECT * FROM cooking_class_reviews WHERE user_id = $1 AND class_id = $2`,
      [user.id, classId]
    );

    if ((existing.rowCount ?? 0) > 0) {
      await pool.query(
        `UPDATE cooking_class_reviews
         SET rating = $1, comment = $2, created_at = CURRENT_TIMESTAMP
         WHERE user_id = $3 AND class_id = $4`,
        [rating, comment, user.id, classId]
      );
      return res.status(200).json({ message: "Rating updated successfully" });
    }

    await pool.query(
      `INSERT INTO cooking_class_reviews (user_id, class_id, rating, comment)
       VALUES ($1, $2, $3, $4)`,
      [user.id, classId, rating, comment]
    );

    res.status(201).json({ message: "Rating submitted successfully" });
  } catch (err) {
    console.error("rateCookingClass error:", err);
    res.status(500).json({ message: "Failed to rate class" });
  }
};

export const updateCookingClassPayment = async (
  req: Request,
  res: Response
) => {
  const user = (req as any).user;
  const classId = parseInt(req.params.id, 10);
  const { payment_done } = req.body;

  if (typeof payment_done !== "boolean") {
    return res
      .status(400)
      .json({ message: "payment_done must be a boolean value" });
  }

  try {
    const classResult = await pool.query(
      `SELECT * FROM cooking_classes WHERE id = $1 AND user_id = $2`,
      [classId, user.id]
    );

    if (classResult.rowCount === 0) {
      return res
        .status(403)
        .json({ message: "Unauthorized or class not found" });
    }

    await pool.query(
      `UPDATE cooking_classes SET payment_done = $1 WHERE id = $2`,
      [payment_done, classId]
    );

    res.status(200).json({ message: "Payment status updated successfully" });
  } catch (err) {
    console.error("updateCookingClassPayment error:", err);
    res.status(500).json({ message: "Failed to update payment status" });
  }
};
