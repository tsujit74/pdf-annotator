import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  addHighlight,
  getHighlights,
  updateHighlight,
  deleteHighlight,
} from "../controllers/highlightController";

const router = express.Router();

// Create
router.post("/add", authMiddleware, addHighlight);

// Read
router.get("/:pdfUuid", authMiddleware, getHighlights);

// Update
router.put("/:id", authMiddleware, updateHighlight);

// Delete
router.delete("/:id", authMiddleware, deleteHighlight);

export default router;
