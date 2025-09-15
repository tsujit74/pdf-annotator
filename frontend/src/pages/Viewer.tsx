import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PDFViewer from "../components/PDFViewer";
import HighlightOverlay, { type Highlight } from "../components/HighlightOverlay";
import { getHighlights, addHighlight } from "../services/highlightService";
import { getPDFByUuid, type PDF } from "../services/pdfService";
import Navbar from "../components/Navbar";

const Viewer: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [numPages, setNumPages] = useState(0);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [pdf, setPdf] = useState<PDF | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (uuid) {
      fetchPDF(uuid);
      fetchHighlights(uuid);
    }
  }, [uuid]);

  const fetchPDF = async (pdfUuid: string) => {
    try {
      const data = await getPDFByUuid(pdfUuid);
      setPdf(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch PDF info", err);
      setError("Failed to load PDF metadata.");
    }
  };

  const fetchHighlights = async (pdfUuid: string) => {
    try {
      const data = await getHighlights(pdfUuid);
      setHighlights(data);
    } catch {
      console.error("Failed to fetch highlights");
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const text = selection.toString();
    const highlight: Highlight = {
      pdfUuid: uuid!,
      page: pageNumber,
      text,
      position: { x: 0, y: 0, width: 0, height: 0 },
    };

    addHighlight(highlight)
      .then(() => fetchHighlights(uuid!))
      .catch(() => alert("Failed to save highlight"));

    selection.removeAllRanges();
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">PDF Viewer</h2>

        {/* Controls */}
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <button onClick={() => setPageNumber(p => Math.max(1, p - 1))}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Prev</button>
          <span className="font-medium">{pageNumber} / {numPages}</span>
          <button onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Next</button>
          <button onClick={() => setScale(s => s + 0.2)}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 ml-4">Zoom In</button>
          <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Zoom Out</button>
        </div>

        <div onMouseUp={handleTextSelection} className="relative border rounded shadow overflow-auto">
          {error && <p className="p-4 text-red-500">{error}</p>}

          {pdf ? (
            <PDFViewer
              fileUrl={`http://localhost:4000/uploads/${encodeURIComponent(pdf.path)}`}
              pageNumber={pageNumber}
              scale={scale}
              onLoadSuccess={(n) => setNumPages(n)}
            />
          ) : !error ? (
            <p className="p-4 text-gray-500">Loading PDF...</p>
          ) : null}

          <HighlightOverlay highlights={highlights} currentPage={pageNumber} />
        </div>

        {/* Highlights */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Highlights on this page</h3>
          <ul className="list-disc ml-6">
            {highlights.filter(h => h.page === pageNumber).map((h, idx) => (
              <li key={idx}>{h.text}</li>
            ))}
            {highlights.filter(h => h.page === pageNumber).length === 0 && (
              <p className="text-gray-500">No highlights on this page.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Viewer;
