import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  followUser,
  unfollowUser,
  getAllUsers,
} from "../controllers/userController";

const router = Router();

router.post("/:id/follow", protect, followUser);
router.delete("/:id/unfollow", protect, unfollowUser);

router.get("/all", protect, getAllUsers);

export default router;
