import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { addHighlight, getHighlights } from "../controllers/highlightController";

const router = express.Router();

router.post("/add", authMiddleware, addHighlight);
router.get("/:pdfUuid", authMiddleware, getHighlights);

export default router;
