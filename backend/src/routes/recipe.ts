// backend/src/routes/recipe.ts - Updated with image upload middleware
import express from "express";
import {
  getRecipe,
  rateRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeDetail,
  addRecipeComment,
  toggleLikeRecipeComment,
  replyToRecipeComment,
  upload, // Import the multer upload middleware
} from "../controllers/recipeController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// get all recipes
router.get("/", protect, getRecipe);

// Get a single recipe by ID
router.get("/:id", protect, getRecipeDetail);

// Create a recipe with image upload
router.post("/", protect, upload.single("image"), createRecipe);

// stars
router.post("/:id/rate", protect, rateRecipe);

// Update a recipe with image upload
router.put("/:id", protect, upload.single("image"), updateRecipe);

// Delete a recipe
router.delete("/:id", protect, deleteRecipe);

// Add a comment to a recipe
router.post("/:id/comments", protect, addRecipeComment);

// Like/unlike a comment on a recipe
router.post("/comments/:commentId/like", protect, toggleLikeRecipeComment);

// Reply to a comment on a recipe
router.post("/comments/:commentId/reply", protect, replyToRecipeComment);

export default router;
