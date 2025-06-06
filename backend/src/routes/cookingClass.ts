import express from "express";
import {
  createCookingClass,
  getCookingClasses,
  deleteCookingClass,
  getCookingClassById,
  rateCookingClass,
  updateCookingClassPayment,
} from "../controllers/cookingClassController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Get all cooking classes
router.get("/", protect, getCookingClasses);

// Create a new cooking class
router.post("/", protect, createCookingClass);

// Delete a cooking class (only if owner)
router.delete("/:id", protect, deleteCookingClass);

// Get a single cooking class by ID
router.get("/:id", getCookingClassById);

router.post("/:id/rate", protect, rateCookingClass);

router.patch("/:id/payment", protect, updateCookingClassPayment);

export default router;
