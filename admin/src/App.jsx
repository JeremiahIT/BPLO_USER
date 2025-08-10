import React from 'react';  
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from "/mainpage/dashboard.jsx";
import NewPermit from "/permits/new_permit.jsx"; // Added .jsx extension

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/permits/new_permit" element={<NewPermit />} />
        <Route path="/permits/renewal_permit" element={<NewPermit />} /> {/* Placeholder */}
      </Routes>
    </Router>
  );
}

export default App; 