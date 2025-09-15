import { Request, Response } from "express";
import Highlight from "../models/Highlight";
import PDF from "../models/PDF";

type HighlightRequest = Request & { userId?: string };

// Add highlight
export const addHighlight = async (req: HighlightRequest, res: Response) => {
  try {
    const { pdfUuid, page, text, position } = req.body;

    // Check if PDF exists and belongs to user
    const pdf = await PDF.findOne({ uuid: pdfUuid, userId: req.userId });
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    const highlight = new Highlight({
      pdfUuid,
      userId: req.userId,
      page,
      text,
      position,
    });

    await highlight.save();
    res.status(201).json({ message: "Highlight saved", highlight });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get highlights
export const getHighlights = async (req: HighlightRequest, res: Response) => {
  try {
    const { pdfUuid } = req.params;

    const highlights = await Highlight.find({
      pdfUuid,
      userId: req.userId,
    });

    res.json({ highlights });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
