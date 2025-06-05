import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { followUser, unfollowUser } from "../controllers/userController";

const router = Router();

router.post("/:id/follow", protect, followUser);
router.delete("/:id/unfollow", protect, unfollowUser);

export default router;
