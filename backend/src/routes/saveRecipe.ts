// backend/src/routes/savedRecipe.ts
import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  saveRecipe,
  getSavedRecipes,
  removeSavedRecipe,
  checkIfRecipeSaved,
} from "../controllers/saveRecipeController";

const router = Router();

// Protected: Save a recipe
router.post("/", protect, saveRecipe);

// Protected: Get all saved recipes
router.get("/", protect, getSavedRecipes);

// Protected: Remove a saved recipe
router.delete("/:recipeId", protect, removeSavedRecipe);

// Protected: Check if recipe is saved
router.get("/check/:recipeId", protect, checkIfRecipeSaved);

export default router;
