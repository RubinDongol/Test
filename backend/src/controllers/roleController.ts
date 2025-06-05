// /controllers/roleController.ts
import { Request, Response } from "express";
import pool from "../config/db";

// GET /api/roles
export const getRoles = async (req: Request, res: Response) => {
  try {
    // const result = await pool.query("SELECT * FROM roles ORDER BY id ASC");
    // Exclude the 'admin' role from the results
    const result = await pool.query("SELECT id, name FROM roles WHERE name != 'admin' ORDER BY id ASC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/roles
export const createRole = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ message: "Please provide a role name" });
    return;
  }

  try {
    const result = await pool.query(
      "INSERT INTO roles (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};