// src/pages/FileViewer.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Tell react-pdf where to find the PDF worker (served from public folder)
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

export default function FileViewer() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const fileUrl = queryParams.get("file");

  const [numPages, setNumPages] = useState(null);

  if (!fileUrl) {
    return (
      <div style={{ padding: "20px" }}>
        <p>No file provided.</p>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "auto" }}>
      <button
        onClick={() => navigate(-1)}
        style={{ margin: "10px", padding: "5px 15px" }}
      >
        ← Back
      </button>

      {fileUrl.endsWith(".pdf") ? (
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<p>Loading PDF...</p>}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={800}
            />
          ))}
        </Document>
      ) : (
        <img
          src={fileUrl}
          alt="Uploaded File"
          style={{
            maxWidth: "100%",
            maxHeight: "90%",
            display: "block",
            margin: "0 auto",
          }}
        />
      )}
    </div>
  );
}
