import React from "react";

export interface Highlight {
  pdfUuid: string;
  page: number;
  text: string;
  position: { x: number; y: number; width: number; height: number };
}

interface HighlightOverlayProps {
  highlights: Highlight[];
  currentPage: number;
}

const HighlightOverlay: React.FC<HighlightOverlayProps> = ({
  highlights,
  currentPage,
}) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {highlights
        .filter((h) => h.page === currentPage)
        .map((h, idx) => (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: h.position.x,
              top: h.position.y,
              width: h.position.width,
              height: h.position.height,
              backgroundColor: "rgba(255,255,0,0.4)",
            }}
          />
        ))}
    </div>
  );
};

export default HighlightOverlay;
