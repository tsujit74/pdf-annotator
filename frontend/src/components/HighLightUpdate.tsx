import { useState } from "react";
import { updateHighlight } from "../services/highlightService";

interface HighlightUpdateProps {
  highlightId: string;
  currentText: string;
  onUpdated: () => void;
}

export default function HighlightUpdate({
  highlightId,
  currentText,
  onUpdated,
}: HighlightUpdateProps) {
  const [text, setText] = useState(currentText);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateHighlight(highlightId, text); 
      onUpdated(); // refresh list in parent
    } catch (err) {
      console.error("Failed to update highlight:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border px-2 py-1 rounded w-full"
      />
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </div>
  );
}
