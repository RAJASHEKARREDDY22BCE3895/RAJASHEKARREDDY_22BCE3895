import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import studentRouter from './routes/student.route.js';
import teacherRouter from './routes/teacher.route.js';
import classRouter from './routes/class.route.js';
import cookieParser from "cookie-parser";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGO)
  .then(() => console.log('✅ Connected to Mongo DB'))
  .catch((err) => console.log('❌ MongoDB connection error:', err));

// Create Express app
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routers
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/class", classRouter);

// Get __dirname with ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend if in production
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start server
app.listen(3000, () => {
  console.log('🚀 Server is running on port 3000!');
});
