// /controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db";
import { User } from "../models/userModel";
import { sendEmail } from '../utils/sendEmails';

// Generate JWT
const generateToken = (id: number): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const { full_name, email, password, role_id, address, bio, photo } = req.body;

  if (!full_name || !email || !password) {
    res
      .status(400)
      .json({ message: "Please provide full name, email, and password" });
    return;
  }

  const userExist = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  
  if (userExist.rows.length > 0) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  const newUser = await pool.query(
    `INSERT INTO users (full_name, email, password, role_id, address, bio, photo, otp_code, otp_expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [
      full_name,
      email,
      hashedPassword,
      role_id || 2,
      address || '',
      bio || '',
      photo || null,
      otp,
      otpExpiresAt
    ]
  );

  const user: User = newUser.rows[0];

  // Send OTP Email
  await sendEmail(
    email,
    "Cookify Account Verification - Your OTP Code",
    `Hello ${full_name},\n\nYour OTP code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nThank you!`
  );
  
  // Now send response
  res.status(201).json({
    id: user.id,
    name: user.full_name,
    email: user.email,
    role_id: user.role_id,
    address: user.address,
    bio: user.bio,
    photo: user.photo,
    created_at: user.created_at,
    updated_at: user.updated_at,
  });  
};

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user: User = userResult.rows[0];

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      name: user.full_name,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};


export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP required" });
  }

  const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const user = userRes.rows[0];

  const now = new Date();
  if (new Date(user.otp_expires_at) < now) {
    return res.status(400).json({ message: "OTP expired. Please request a new one." });
  }
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.is_verified) {
    return res.status(400).json({ message: "User already verified" });
  }

  if (user.otp_code !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  await pool.query(
    "UPDATE users SET is_verified = TRUE, otp_code = NULL WHERE email = $1",
    [email]
  );

  res.status(200).json({ message: "Email verified successfully" });
};


// @desc    Get user profile (Protected)
// @route   GET /api/auth/profile
export const getProfile = async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    // Fetch latest user data
    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [user.id]);
    const currentUser = userResult.rows[0];

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch user's posts
    const postsResult = await pool.query(
      `
      SELECT 
        p.*, 
        COALESCE(l.like_count, 0)::int AS like_count,
        COALESCE(c.comment_count, 0)::int AS comment_count,
        EXISTS (
          SELECT 1 FROM bookmarks b WHERE b.post_id = p.id AND b.user_id = $1
        ) AS is_bookmarked,
        EXISTS (
          SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = $1
        ) AS is_liked
      FROM posts p
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS like_count
        FROM likes
        GROUP BY post_id
      ) l ON l.post_id = p.id
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS comment_count
        FROM comments
        GROUP BY post_id
      ) c ON c.post_id = p.id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
      `,
      [user.id]
    );
    

    const { password, otp_code, otp_expires_at, ...safeUser } = currentUser;

    res.status(200).json({
      ...safeUser,
      posts: postsResult.rows,
    });
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};


export const resendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const user: User = userRes.rows[0];

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.is_verified) {
    return res.status(400).json({ message: "User already verified" });
  }

  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes again

  // Update OTP in database
  await pool.query(
    "UPDATE users SET otp_code = $1, otp_expires_at = $2 WHERE email = $3",
    [otp, otpExpiresAt, email]
  );

  // Send OTP Email
  await sendEmail(
    email,
    "Cookify - Resent OTP Code",
    `Hello ${user.full_name},\n\nYour new OTP code is: ${otp}\n\nIt will expire in 10 minutes.\n\nThank you!`
  );

  res.status(200).json({ message: "A new OTP has been sent to your email." });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const user: User = userRes.rows[0];

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!user.is_verified) {
    return res.status(400).json({ message: "Email is not verified. Cannot reset password." });
  }

  // Generate new OTP for password reset
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await pool.query(
    "UPDATE users SET otp_code = $1, otp_expires_at = $2 WHERE email = $3",
    [otp, otpExpiresAt, email]
  );

  await sendEmail(
    email,
    "Cookify - Password Reset OTP",
    `Hello ${user.full_name},\n\nYour password reset OTP is: ${otp}\n\nIt will expire in 10 minutes.\n\nThank you!`
  );

  res.status(200).json({ message: "Password reset OTP sent to your email." });
};

export const verifyPasswordOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const user: User = userRes.rows[0];

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

const now = new Date();
if (!user.otp_code || !user.otp_expires_at || new Date(user.otp_expires_at) < now) {
  return res.status(400).json({ message: "OTP expired or not found. Request new one." });
}


  if (user.otp_code !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // Mark OTP as verified (optional, or let reset-password use this)
  await pool.query(
    "UPDATE users SET otp_code = NULL WHERE email = $1",
    [email]
  );

  res.status(200).json({ message: "OTP verified successfully. You can now reset your password." });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required" });
  }

  const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const user: User = userRes.rows[0];

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await pool.query(
    "UPDATE users SET password = $1 WHERE email = $2",
    [hashedPassword, email]
  );

  res.status(200).json({ message: "Password reset successful. You can now login with your new password." });
};

export const updateProfile = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { full_name, address, bio, photo } = req.body;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const updatedAt = new Date();

  try {
    const updated = await pool.query(
      `UPDATE users 
       SET full_name = $1, address = $2, bio = $3, photo = $4, updated_at = $5 
       WHERE id = $6 RETURNING *`,
      [
        full_name || user.full_name,
        address || user.address,
        bio || user.bio,
        photo || user.photo,
        updatedAt,
        user.id,
      ]
    );

    const updatedUser = updated.rows[0];
    const { password, otp_code, otp_expires_at, ...safeUser } = updatedUser;

    res.status(200).json(safeUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const logoutUser = async (_req: Request, res: Response) => {
  res.status(200).json({ message: "User logged out successfully" });
};
