import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { pdfjs } from "react-pdf";

// ✅ correct worker path for pdfjs-dist@3.x
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString(); // 👈 convert URL object → string

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
