import api from "./api";

export interface Highlight {
  pdfUuid: string;
  page: number;
  text: string;
  position?: { x: number; y: number; width: number; height: number };
}

export const addHighlight = async (highlight: Highlight) => {
  const res = await api.post("/highlight/add", highlight);
  return res.data;
};

export const getHighlights = async (pdfUuid: string) => {
  const res = await api.get<{ highlights: Highlight[] }>(`/highlight/${pdfUuid}`);
  return res.data.highlights;
};
