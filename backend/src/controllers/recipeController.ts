import { Request, Response } from "express";
import pool from "../config/db";

// Get all recipes
export const getRecipe = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        chefs,
        COALESCE(free_recipes, '[]'::json) AS free_recipes,
        COALESCE(premium_recipes, '[]'::json) AS premium_recipes
      FROM recipe_overview
    `);

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("getAllRecipes error:", err);
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

// create a new recipe
export const createRecipe = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const {
    name,
    type,
    cost,
    description,
    cooking_time,
    difficulty,
    tags,
    ingredients,
    directions,
  } = req.body;

  try {
    const recipeResult = await pool.query(
      `INSERT INTO recipes (user_id, name, type, cost, description, cooking_time, difficulty, tags, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NULL) RETURNING *`,
      [
        user.id,
        name,
        type,
        type === "premium" ? cost : 0,
        description,
        cooking_time,
        difficulty,
        tags || null,
      ]
    );

    const recipeId = recipeResult.rows[0].id;

    for (const ing of ingredients) {
      await pool.query(
        `INSERT INTO ingredients (recipe_id, name, quantity) VALUES ($1, $2, $3)`,
        [recipeId, ing.name, ing.quantity]
      );
    }

    for (const [index, dir] of directions.entries()) {
      await pool.query(
        `INSERT INTO directions (recipe_id, step_number, instruction) VALUES ($1, $2, $3)`,
        [recipeId, index + 1, dir]
      );
    }

    res.status(201).json({ message: "Recipe created successfully", recipeId });
  } catch (err) {
    console.error("createRecipe error:", err);
    res.status(500).json({ message: "Failed to create recipe" });
  }
};

// update recipe
export const updateRecipe = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const recipeId = parseInt(req.params.id);
  const {
    name,
    type,
    cost,
    description,
    cooking_time,
    difficulty,
    tags,
    ingredients,
    directions,
  } = req.body;

  try {
    const recipeRes = await pool.query(
      `SELECT * FROM recipes WHERE id = $1 AND user_id = $2`,
      [recipeId, user.id]
    );

    if (recipeRes.rowCount === 0) {
      return res
        .status(403)
        .json({ message: "Unauthorized or recipe not found" });
    }

    await pool.query(
      `UPDATE recipes SET name = $1, type = $2, cost = $3, description = $4, cooking_time = $5, difficulty = $6, tags = $7
       WHERE id = $8`,
      [
        name,
        type,
        type === "premium" ? cost : 0,
        description,
        cooking_time,
        difficulty,
        tags,
        recipeId,
      ]
    );

    await pool.query(`DELETE FROM ingredients WHERE recipe_id = $1`, [
      recipeId,
    ]);
    for (const ing of ingredients) {
      await pool.query(
        `INSERT INTO ingredients (recipe_id, name, quantity) VALUES ($1, $2, $3)`,
        [recipeId, ing.name, ing.quantity]
      );
    }

    await pool.query(`DELETE FROM directions WHERE recipe_id = $1`, [recipeId]);
    for (const [index, dir] of directions.entries()) {
      await pool.query(
        `INSERT INTO directions (recipe_id, step_number, instruction) VALUES ($1, $2, $3)`,
        [recipeId, index + 1, dir]
      );
    }

    res.status(200).json({ message: "Recipe updated successfully" });
  } catch (err) {
    console.error("updateRecipe error:", err);
    res.status(500).json({ message: "Failed to update recipe" });
  }
};

// delete recipe
export const deleteRecipe = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const recipeId = parseInt(req.params.id);

  try {
    const recipeRes = await pool.query(
      `SELECT * FROM recipes WHERE id = $1 AND user_id = $2`,
      [recipeId, user.id]
    );

    if (recipeRes.rowCount === 0) {
      return res
        .status(403)
        .json({ message: "Unauthorized or recipe not found" });
    }

    // Delete dependent records in order
    await pool.query(
      `DELETE FROM recipe_comment_likes WHERE comment_id IN (
      SELECT id FROM recipe_comments WHERE recipe_id = $1
    )`,
      [recipeId]
    );

    await pool.query(
      `DELETE FROM recipe_comment_replies WHERE comment_id IN (
      SELECT id FROM recipe_comments WHERE recipe_id = $1
    )`,
      [recipeId]
    );

    await pool.query(`DELETE FROM recipe_comments WHERE recipe_id = $1`, [
      recipeId,
    ]);
    await pool.query(`DELETE FROM recipe_ratings WHERE recipe_id = $1`, [
      recipeId,
    ]);
    await pool.query(`DELETE FROM ingredients WHERE recipe_id = $1`, [
      recipeId,
    ]);
    await pool.query(`DELETE FROM directions WHERE recipe_id = $1`, [recipeId]);

    // Finally delete the recipe
    await pool.query(`DELETE FROM recipes WHERE id = $1`, [recipeId]);

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error("deleteRecipe error:", err);
    res.status(500).json({ message: "Failed to delete recipe" });
  }
};

// Rate a recipe
export const rateRecipe = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const recipeId = parseInt(req.params.id, 10);
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    await pool.query(
      `
      INSERT INTO recipe_ratings (user_id, recipe_id, rating)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, recipe_id)
      DO UPDATE SET rating = $3, created_at = CURRENT_TIMESTAMP
      `,
      [user.id, recipeId, rating]
    );

    res.status(200).json({ message: "Rating submitted successfully" });
  } catch (err) {
    console.error("rateRecipe error:", err);
    res.status(500).json({ message: "Failed to submit rating" });
  }
};

// @desc Get full recipe detail by ID with ingredients, directions, comments, and nested replies
export const getRecipeDetail = async (req: Request, res: Response) => {
  const recipeId = parseInt(req.params.id);
  const user = (req as any).user;

  try {
    const recipeResult = await pool.query(
      `SELECT r.*, u.full_name, u.photo,
        ROUND(AVG(rt.rating), 1) AS stars,
        COUNT(rt.*) AS review_count
       FROM recipes r
       JOIN users u ON r.user_id = u.id
       LEFT JOIN recipe_ratings rt ON r.id = rt.recipe_id
       WHERE r.id = $1
       GROUP BY r.id, u.id`,
      [recipeId]
    );

    if (recipeResult.rowCount === 0) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const recipe = recipeResult.rows[0];

    const ingredients = await pool.query(
      `SELECT name, quantity FROM ingredients WHERE recipe_id = $1`,
      [recipeId]
    );

    const directions = await pool.query(
      `SELECT step_number, instruction FROM directions WHERE recipe_id = $1 ORDER BY step_number ASC`,
      [recipeId]
    );

    const commentsResult = await pool.query(
      `SELECT c.*, u.full_name, u.photo,
        (SELECT COUNT(*) FROM recipe_comment_likes l WHERE l.comment_id = c.id) AS like_count
       FROM recipe_comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.recipe_id = $1
       ORDER BY c.created_at ASC`,
      [recipeId]
    );

    const comments = await Promise.all(
      commentsResult.rows.map(async (comment) => {
        const repliesResult = await pool.query(
          `SELECT r.*, u.full_name, u.photo
           FROM recipe_comment_replies r
           JOIN users u ON r.user_id = u.id
           WHERE r.comment_id = $1
           ORDER BY r.created_at ASC`,
          [comment.id]
        );

        return {
          ...comment,
          like_count: parseInt(comment.like_count, 10),
          replies: repliesResult.rows,
        };
      })
    );

    res.status(200).json({
      ...recipe,
      ingredients: ingredients.rows,
      directions: directions.rows,
      comments,
    });
  } catch (err) {
    console.error("getRecipeDetail error:", err);
    res.status(500).json({ message: "Failed to fetch recipe detail" });
  }
};

// Add a comment to a recipe
export const addRecipeComment = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const recipeId = parseInt(req.params.id, 10);
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO recipe_comments (user_id, recipe_id, text)
       VALUES ($1, $2, $3) RETURNING *`,
      [user.id, recipeId, text]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("addRecipeComment error:", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// Toggle like/unlike a recipe comment
export const toggleLikeRecipeComment = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const commentId = parseInt(req.params.commentId, 10);

  try {
    const existing = await pool.query(
      `SELECT * FROM recipe_comment_likes WHERE user_id = $1 AND comment_id = $2`,
      [user.id, commentId]
    );

    if ((existing?.rowCount ?? 0) > 0) {
      await pool.query(
        `DELETE FROM recipe_comment_likes WHERE user_id = $1 AND comment_id = $2`,
        [user.id, commentId]
      );
      return res.status(200).json({ liked: false });
    }

    await pool.query(
      `INSERT INTO recipe_comment_likes (user_id, comment_id) VALUES ($1, $2)`,
      [user.id, commentId]
    );

    res.status(200).json({ liked: true });
  } catch (err) {
    console.error("toggleLikeRecipeComment error:", err);
    res.status(500).json({ message: "Failed to like/unlike comment" });
  }
};

// Reply to a recipe comment
export const replyToRecipeComment = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const commentId = parseInt(req.params.commentId, 10);
  const { text } = req.body;

  if (!text || isNaN(commentId)) {
    return res
      .status(400)
      .json({ message: "Valid comment ID and reply text are required" });
  }

  try {
    // Insert reply
    const replyResult = await pool.query(
      `INSERT INTO recipe_comment_replies (comment_id, user_id, text)
       VALUES ($1, $2, $3)
       RETURNING id, comment_id, user_id, text, created_at`,
      [commentId, user.id, text]
    );

    const reply = replyResult.rows[0];

    // Get user details for the reply
    const userResult = await pool.query(
      `SELECT full_name, photo FROM users WHERE id = $1`,
      [user.id]
    );

    const userInfo = userResult.rows[0];

    // Combine reply and user info
    res.status(201).json({
      ...reply,
      full_name: userInfo.full_name,
      photo: userInfo.photo,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to reply to comment" });
  }
};
