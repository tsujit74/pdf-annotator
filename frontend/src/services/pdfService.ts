import api from "./api";

export interface PDF {
  uuid: string;
  filename: string;
  path: string;
}

// Upload PDF
export const uploadPDF = async (file: File) => {
  const formData = new FormData();
  formData.append("pdf", file);

  const res = await api.post("/pdf/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Get all PDFs
export const getPDFs = async () => {
  const res = await api.get<{ pdfs: PDF[] }>("/pdf/list");
  return res.data.pdfs;
};

// Get a single PDF by UUID
export const getPDFByUuid = async (uuid: string): Promise<PDF> => {
  const pdfs = await getPDFs();
  const pdf = pdfs.find((p) => p.uuid === uuid);
  if (!pdf) throw new Error("PDF not found");
  return pdf;
};
