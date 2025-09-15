import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

interface PDFViewerProps {
  fileUrl: string;
  pageNumber?: number;
  scale?: number;
  onLoadSuccess?: (numPages: number) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  fileUrl,
  pageNumber = 1,
  scale = 1.5,
  onLoadSuccess,
}) => {
  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    onLoadSuccess?.(numPages);
  };

  const handleLoadError = (err: any) => {
    console.error("PDF load error:", err);
  };

  return (
    <div className="border w-full max-w-full overflow-auto bg-white">
      <Document
        file={fileUrl}
        onLoadSuccess={handleLoadSuccess}
        onLoadError={handleLoadError}
      >
        <Page pageNumber={pageNumber} scale={scale} />
      </Document>
    </div>
  );
};

export default PDFViewer;
