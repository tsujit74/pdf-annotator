import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPDFs, uploadPDF, type PDF } from "../services/pdfService";
import { removeToken } from "../utils/auth";

const Dashboard: React.FC = () => {
  const [pdfs, setPDFs] = useState<PDF[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch PDFs on mount
  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      const data = await getPDFs();
      setPDFs(data);
    } catch (err) {
      alert("Failed to fetch PDFs");
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a PDF to upload");
    setLoading(true);
    try {
      await uploadPDF(file);
      setFile(null);
      fetchPDFs();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate("/auth");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded mb-6 hover:bg-red-600"
      >
        Logout
      </button>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
          className="border p-2 rounded"
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload PDF"}
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-2">Your PDFs</h3>
      <ul>
        {pdfs.map((pdf) => (
          <li key={pdf.uuid} className="mb-2 flex items-center justify-between">
            <span>{pdf.filename}</span>
            <button
              onClick={() => navigate(`/viewer/${pdf.uuid}`)}
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            >
              Open
            </button>
          </li>
        ))}
        {pdfs.length === 0 && <p>No PDFs uploaded yet.</p>}
      </ul>
    </div>
  );
};

export default Dashboard;
