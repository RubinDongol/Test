// backend/src/config/db.ts - Fix the typo in bookmarks table
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export const connectDB = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log("PostgreSQL Connected Successfully");

    // Create roles table first
    await client.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL
      );
    `);

    // Insert default roles if not exists
    await client.query(`
      INSERT INTO roles (name)
      VALUES ('admin'), ('user'), ('chief')
      ON CONFLICT (name) DO NOTHING;
    `);

    // Then create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role_id INTEGER REFERENCES roles(id) DEFAULT 2,
        address TEXT,
        bio TEXT,
        photo TEXT DEFAULT NULL,
        otp_code VARCHAR(6),
        otp_expires_at TIMESTAMP,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Roles table ready with default values");
    console.log("Users table ready");

    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Posts table ready");

    // Likes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        post_id INTEGER REFERENCES posts(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_id, post_id)
      );
    `);
    console.log("Likes table ready");

    // Comments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        post_id INTEGER REFERENCES posts(id),
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Comments table ready");

    // Bookmarks table - FIXED the typo (removed the 'w' after user_id)
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        post_id INTEGER REFERENCES posts(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_id, post_id)
      );
    `);
    console.log("Bookmarks table ready");

    await client.query(`
      CREATE TABLE IF NOT EXISTS follows (
        id SERIAL PRIMARY KEY,
        follower_id INTEGER REFERENCES users(id),
        following_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (follower_id, following_id)
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS saved_recipes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        recipe_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        image TEXT,
        description TEXT,
        cooking_time INTEGER DEFAULT 0,
        servings INTEGER DEFAULT 1,
        difficulty VARCHAR(50) DEFAULT 'Medium',
        rating DECIMAL(3,2) DEFAULT 0.0,
        chef VARCHAR(255),
        ingredients TEXT,
        directions TEXT,
        tags TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_id, recipe_id)
      );
    `);
    console.log("Follows table ready");

    client.release();
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
    process.exit(1);
  }
};

export default pool;
