// /routes/role.ts
import { Router } from "express";
import { getRoles, createRole } from "../controllers/roleController";

const router = Router();

// Get all roles
router.get("/", getRoles);

// Create new role (optional)
router.post("/", createRole);

export default router;
