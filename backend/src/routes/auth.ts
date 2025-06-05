// /routes/auth.ts
import { Router } from "express";
import {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp,
  getProfile,
  forgotPassword,
  verifyPasswordOtp,
  resetPassword,
  updateProfile,
  logoutUser,
  getUserProfile,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Protected Route Example (Profile)
router.get("/profile", protect, getProfile);
router.get("/profile/:userId", protect, getUserProfile);

router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

router.post("/forgot-password", forgotPassword);
router.post("/verify-password-otp", verifyPasswordOtp);
router.post("/reset-password", resetPassword);
router.put("/profile", protect, updateProfile);

// Logout User
router.post("/logout", protect, logoutUser);
export default router;
