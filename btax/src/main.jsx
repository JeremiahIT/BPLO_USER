// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Dashboard from './components/Dashboard';
import Tax from './TaxComputation/Tax';   // ✅ Use singular to match component
import ExaminersD from './ExaminersDivision/Examiners';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Tax" element={<Tax />} />   {/* ✅ Use Tax */}
        <Route path="/Examiners" element={<ExaminersD />} />
        <Route path="/app" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
