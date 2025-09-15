import React from "react";
import { useNavigate } from "react-router-dom";

export interface PDFItem {
  uuid: string;
  filename: string;
}

interface PDFListProps {
  pdfs: PDFItem[];
}

const PDFList: React.FC<PDFListProps> = ({ pdfs }) => {
  const navigate = useNavigate();

  return (
    <ul className="space-y-2">
      {pdfs.map((pdf) => (
        <li key={pdf.uuid} className="flex justify-between items-center border p-2 rounded shadow">
          <span>{pdf.filename}</span>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={() => navigate(`/viewer/${pdf.uuid}`)}
          >
            Open
          </button>
        </li>
      ))}
      {pdfs.length === 0 && <p>No PDFs uploaded yet.</p>}
    </ul>
  );
};

export default PDFList;
