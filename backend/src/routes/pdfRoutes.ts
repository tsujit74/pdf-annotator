import express from "express";
import multer from "multer";
import path from "path";
import { authMiddleware } from "../middleware/authMiddleware";
import { uploadPDF, getPDFs } from "../controllers/pdfController";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Use inline type casting in route handlers
router.post("/upload", authMiddleware, upload.single("pdf"), (req, res) =>
  uploadPDF(req as any, res)
);

router.get("/list", authMiddleware, (req, res) =>
  getPDFs(req as any, res)
);

export default router;
