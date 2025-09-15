import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import pdfRoutes from "./routes/pdfRoutes";
import highlightRoutes from "./routes/highlightRoutes";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173" })); // allow Vite frontend
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded PDFs as static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Environment variables
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pdfAnnotator";
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/auth", authRoutes);
app.use("/pdf", pdfRoutes);
app.use("/highlight", highlightRoutes);

// Root endpoint
app.get("/", (_req: Request, res: Response) => {
  res.send("PDF Annotator Backend is running");
});

// Handle 404 for unknown routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("💥Server error:", err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: any, _promise) => {
  console.error("💥Unhandled Rejection:", reason);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("💥Uncaught Exception:", err);
  process.exit(1);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
