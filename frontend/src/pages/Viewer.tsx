import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PDFViewer from "../components/PDFViewer";
import HighlightOverlay, {
} from "../components/HighlightOverlay";
import { type Highlight } from "../types/Highlight";
import {
  getHighlights,
  addHighlight,
  deleteHighlight,
} from "../services/highlightService";
import { getPDFByUuid, type PDF } from "../services/pdfService";
import HighlightUpdate from "../components/HighLightUpdate";

const Viewer: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [numPages, setNumPages] = useState(0);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [pdf, setPdf] = useState<PDF | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

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
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const pageEl = document.querySelector(
      `.react-pdf__Page[data-page-number="${pageNumber}"]`
    ) as HTMLElement;

    if (!pageEl) return;

    const containerRect = pageEl.getBoundingClientRect();

    const position = {
      x: rect.left - containerRect.left,
      y: rect.top - containerRect.top,
      width: rect.width,
      height: rect.height,
    };

    const highlight: Highlight = {
        pdfUuid: uuid!,
        page: pageNumber,
        text,
        position,
        _id: null
    };

    addHighlight(highlight)
      .then(() => fetchHighlights(uuid!))
      .catch(() => alert("Failed to save highlight"));

    selection.removeAllRanges();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this highlight?")) {
      return;
    }

    try {
      await deleteHighlight(id);
      fetchHighlights(uuid!);
    } catch {
      alert("Failed to delete highlight");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-slate-200 font-sans">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            PDF Viewer
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PDF Section */}
          <div className="lg:col-span-2">
            {/* Controls */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-4 flex flex-wrap gap-3 items-center justify-center sm:justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200"
                >
                  Prev
                </button>
                <span className="font-semibold text-gray-800">
                  Page {pageNumber} of {numPages}
                </span>
                <button
                  onClick={() =>
                    setPageNumber((p) => Math.min(numPages, p + 1))
                  }
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200"
                >
                  Next
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScale((s) => s + 0.2)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full"
                >
                  Zoom In
                </button>
                <button
                  onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full"
                >
                  Zoom Out
                </button>
              </div>
            </div>

            {/* PDF with highlights */}
            <div
              onMouseUp={handleTextSelection}
              className="relative inline-block border border-gray-300 rounded-lg shadow-2xl overflow-hidden bg-white w-full"
            >
              {error && <p className="p-8 text-center text-red-500">{error}</p>}
              {pdf ? (
                <>
                  <PDFViewer
                    fileUrl={`http://localhost:4000/uploads/${encodeURIComponent(
                      pdf.path
                    )}`}
                    pageNumber={pageNumber}
                    scale={scale}
                    onLoadSuccess={(n) => setNumPages(n)}
                  />
                  <HighlightOverlay
                    highlights={highlights}
                    currentPage={pageNumber}
                  />
                </>
              ) : !error ? (
                <p className="p-8 text-center text-gray-500">Loading PDF...</p>
              ) : null}
            </div>
          </div>

          {/* Highlights Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Highlights
              </h3>
              <ul className="space-y-4">
                {highlights
                  .filter((h) => h.page === pageNumber)
                  .map((h, idx) => (
                    <li
                      key={idx}
                      className="bg-yellow-50 p-3 rounded-lg border border-yellow-200"
                    >
                      {editingId === h._id ? (
                        <HighlightUpdate
                          highlightId={h._id!}
                          currentText={h.text}
                          onUpdated={() => {
                            setEditingId(null);
                            fetchHighlights(uuid!);
                          }}
                        />
                      ) : (
                        <>
                          <p className="text-gray-700 italic">{h.text}</p>
                          <div className="flex gap-3 mt-2">
                            <button
                              onClick={() => setEditingId(h._id!)}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(h._id!)}
                              className="text-sm text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                {highlights.filter((h) => h.page === pageNumber).length ===
                  0 && (
                  <p className="text-gray-500 italic">
                    No highlights on this page.
                  </p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewer;
