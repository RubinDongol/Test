import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { createPost, getAllPosts, toggleLikePost, addComment, getCommentsByPostId, toggleBookmarkPost, getBookmarkedPosts, getFollowingPosts } from "../controllers/postController";

const router = Router();

// Protected: Create new post
router.post("/", protect, createPost);

// Public: Get all posts
router.get("/", protect, getAllPosts);

// Protected: Like or unlike a post
router.post("/:id/like", protect, toggleLikePost);

// Protected: Add comment to a post
router.post("/:id/comment", protect, addComment); // - Add comment to a post    
router.get("/:id/comments", getCommentsByPostId); // - Get all comments by post ID

// Protected: Bookmark or unbookmark a post
router.post("/:id/bookmark", protect, toggleBookmarkPost);

// Protected: Get all bookmarked posts
router.get("/bookmarked", protect, getBookmarkedPosts);

// Protected: Get all posts from followed users
router.get("/following", protect, getFollowingPosts);

export default router;
