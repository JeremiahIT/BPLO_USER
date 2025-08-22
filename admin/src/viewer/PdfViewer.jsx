// src/viewer/PdfViewer.jsx
import { useSearchParams, useNavigate } from "react-router-dom";
import { Document, Page } from "react-pdf";
import { useState } from "react";

export default function PdfViewer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileUrl = searchParams.get("file");
  const [numPages, setNumPages] = useState(null);

  if (!fileUrl) {
    return (
      <div>
        <p>No file provided.</p>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  return (
    <div className="pdf-viewer">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
    </div>
  );
}
