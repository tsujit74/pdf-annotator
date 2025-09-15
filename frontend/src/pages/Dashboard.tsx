import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPDFs,
  uploadPDF,
  renamePDF,
  deletePDF,
  type PDF,
} from "../services/pdfService";

const Dashboard: React.FC = () => {
  const [pdfs, setPDFs] = useState<PDF[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      setError(null);
      const data = await getPDFs();
      setPDFs(data);
    } catch {
      setError("Failed to fetch PDFs. Please try again.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file to upload.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await uploadPDF(file);
      setFile(null);
      fetchPDFs();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async (uuid: string) => {
    if (!newName.trim()) {
      setError("New name cannot be empty.");
      return;
    }
    try {
      await renamePDF(uuid, newName);
      setRenamingId(null);
      setNewName("");
      fetchPDFs();
    } catch {
      setError("Failed to rename PDF. Try again.");
    }
  };

  const handleDelete = async (uuid: string) => {
    if (!window.confirm("Are you sure you want to delete this PDF?")) return;
    try {
      await deletePDF(uuid);
      fetchPDFs();
    } catch {
      setError("Failed to delete PDF. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Inline Error */}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Upload a New PDF
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:bg-gray-200 file:border-0 file:px-4 file:py-2 file:mr-4 file:rounded-md hover:file:bg-gray-300"
            />
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Uploading..." : "Upload PDF"}
            </button>
          </div>
        </div>

        {/* Your PDFs Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Documents
            </h2>
          </div>

          {pdfs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p className="mt-2 text-sm font-medium">
                No PDFs uploaded yet. Upload one to get started!
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {pdfs.map((pdf) => (
                <li
                  key={pdf.uuid}
                  className="bg-gray-100 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-transform duration-200 transform hover:scale-[1.01] hover:shadow-lg"
                >
                  {renamingId === pdf.uuid ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="border rounded p-2 flex-1"
                        placeholder="Enter new name"
                      />
                      <button
                        onClick={() => handleRename(pdf.uuid)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setRenamingId(null)}
                        className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-800 font-medium truncate flex-1">
                      {pdf.filename}
                    </span>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/viewer/${pdf.uuid}`)}
                      className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition-colors duration-200"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => {
                        setRenamingId(pdf.uuid);
                        setNewName(pdf.filename);
                      }}
                      className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg shadow hover:bg-yellow-600 transition"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => handleDelete(pdf.uuid)}
                      className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
