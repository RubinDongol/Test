// backend/src/routes/notification.ts
import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  getNotifications,
  markNotificationsAsRead,
} from "../controllers/notificationController";

const router = Router();

// Get notifications for the authenticated user
router.get("/", protect, getNotifications);

// Mark notifications as read
router.post("/mark-read", protect, markNotificationsAsRead);

export default router;
