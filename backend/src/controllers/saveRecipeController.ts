// backend/src/controllers/savedRecipeController.ts
import { Request, Response } from "express";
import pool from "../config/db";

// @desc Save a recipe to user's collection
export const saveRecipe = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const {
    recipe_id,
    title,
    image,
    description,
    cooking_time,
    servings,
    difficulty,
    rating,
    chef,
    ingredients,
    directions,
    tags,
  } = req.body;

  if (!recipe_id || !title) {
    return res
      .status(400)
      .json({ message: "Recipe ID and title are required" });
  }

  try {
    // Check if recipe is already saved
    const existingRecipe = await pool.query(
      "SELECT * FROM saved_recipes WHERE user_id = $1 AND recipe_id = $2",
      [user.id, recipe_id]
    );

    if (existingRecipe.rows.length > 0) {
      return res.status(400).json({ message: "Recipe already saved" });
    }

    // Save the recipe
    const result = await pool.query(
      `INSERT INTO saved_recipes 
       (user_id, recipe_id, title, image, description, cooking_time, servings, difficulty, rating, chef, ingredients, directions, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        user.id,
        recipe_id,
        title,
        image,
        description,
        cooking_time,
        servings,
        difficulty,
        rating,
        chef,
        ingredients,
        directions,
        tags,
      ]
    );

    res.status(201).json({
      message: "Recipe saved successfully",
      recipe: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save recipe" });
  }
};

// @desc Get all saved recipes for a user
export const getSavedRecipes = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    const result = await pool.query(
      "SELECT * FROM saved_recipes WHERE user_id = $1 ORDER BY created_at DESC",
      [user.id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch saved recipes" });
  }
};

// @desc Remove a saved recipe
export const removeSavedRecipe = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { recipeId } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM saved_recipes WHERE user_id = $1 AND recipe_id = $2 RETURNING *",
      [user.id, recipeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Saved recipe not found" });
    }

    res.status(200).json({ message: "Recipe removed from saved collection" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove saved recipe" });
  }
};

// @desc Check if a recipe is saved
export const checkIfRecipeSaved = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { recipeId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM saved_recipes WHERE user_id = $1 AND recipe_id = $2",
      [user.id, recipeId]
    );

    res.status(200).json({
      is_saved: result.rows.length > 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to check recipe status" });
  }
};
