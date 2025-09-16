import api from "./api";
import { type Highlight } from "../types/Highlight"; 

// Add highlight
export const addHighlight = async (highlight: Highlight) => {
  const res = await api.post("/highlight/add", highlight);
  return res.data;
};

// Get highlights for a PDF
export const getHighlights = async (pdfUuid: string) => {
  const res = await api.get<{ highlights: Highlight[] }>(`/highlight/${pdfUuid}`);
  return res.data.highlights;
};

// Update highlight
export const updateHighlight = async (id: string, text: string) => {
  const res = await api.put(`/highlight/${id}`, { text });
  return res.data;
};

// Delete highlight
export const deleteHighlight = async (id: string) => {
  const res = await api.delete(`/highlight/${id}`);
  return res.data;
};
