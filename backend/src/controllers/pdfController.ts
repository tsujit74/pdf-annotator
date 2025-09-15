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
      path: req.file.filename, // store only filename
      userId: req.userId,
    });

    await pdf.save();
    res.status(201).json({ message: "PDF uploaded successfully", pdf });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// List User PDFs
export const getPDFs = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const pdfs = await PDF.find({ userId: req.userId });
    res.json({ pdfs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Rename PDF
export const renamePDF = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const { uuid } = req.params;
    const { newName } = req.body;

    if (!newName || newName.trim() === "") {
      return res.status(400).json({ message: "New name is required" });
    }

    const pdf = await PDF.findOneAndUpdate(
      { uuid, userId: req.userId },
      { filename: newName.trim() },
      { new: true }
    );

    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    res.json({ message: "PDF renamed successfully", pdf });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete PDF
export const deletePDF = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const { uuid } = req.params;

    const pdf = await PDF.findOneAndDelete({ uuid, userId: req.userId });
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    res.json({ message: "PDF deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
