import { Request, Response } from "express";
import PDF, { IPDF } from "../models/PDF";
import { v4 as uuidv4 } from "uuid";

// Inline request type combining Auth + Multer
type UploadRequest = Request & { userId?: string; file?: Express.Multer.File };

// Upload PDF
export const uploadPDF = async (req: UploadRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const pdf: IPDF = new PDF({
      uuid: uuidv4(),
      filename: req.file.originalname,
      path: req.file.path,
      userId: req.userId,
    });

    await pdf.save();
    res.status(201).json({ message: "PDF uploaded successfully", pdf });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// List User PDFs
export const getPDFs = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const pdfs = await PDF.find({ userId: req.userId });
    res.json({ pdfs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
