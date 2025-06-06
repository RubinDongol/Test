// backend/src/server.ts - Add static file serving for uploaded images
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import { createServer } from "http";
import express, { Request, Response, Application } from "express";
import path from "path";

// Routes
import authRoutes from "./routes/auth";
import roleRoutes from "./routes/role";
import postRoutes from "./routes/post";
import userRoutes from "./routes/user";
import recipeRoutes from "./routes/recipe";
import savedRecipeRoutes from "./routes/saveRecipe";

// DB
import { connectDB } from "./config/db";

// For env File
dotenv.config();

const app: Application = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());

// Serve static files for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Database Connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/saved-recipes", savedRecipeRoutes);

// Test Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server running" });
});

// live classes server
// Store users by room
const users: { [groupId: string]: string[] } = {};
io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  socket.on("joinRoom", ({ groupId }) => {
    if (!users[groupId]) {
      users[groupId] = [];
    }

    if (!users[groupId].includes(socket.id)) {
      users[groupId].push(socket.id);
      console.log(`${socket.id} joined room: ${groupId}`);
    } else {
      console.log(`${socket.id} already in room ${groupId}`);
    }

    console.log(`Users in ${groupId}:`, users[groupId]);

    const otherUsers = users[groupId].filter((id) => id !== socket.id);
    socket.emit("allUsers", otherUsers);

    socket.on("sendingSignal", (payload) => {
      console.log(`${socket.id} sending signal to ${payload.userToCall}`);
      io.to(payload.userToCall).emit("user-joined", {
        signal: payload.signal,
        callerID: socket.id,
      });
    });

    socket.on("returningSignal", (payload) => {
      console.log(`${socket.id} returning signal to ${payload.to}`);
      io.to(payload.to).emit("receivingReturnedSignal", {
        signal: payload.signal,
        id: socket.id,
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      for (const roomId in users) {
        users[roomId] = users[roomId].filter((id) => id !== socket.id);
        if (users[roomId].length === 0) {
          delete users[roomId];
          console.log(`🧹 Room ${roomId} deleted (empty)`);
        }
      }
    });
  });
});

// Start Server
server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
