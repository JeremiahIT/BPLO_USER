import React from 'react';  
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from "./mainpage/dashboard";
import NewPermit from "./permits/new_permit";
import RenewalPermit from "./permits/renewal_permit";
import Zoning from './Backroom/zoning';
import BackroomDashboard from './Backroom/brdashboard';
import PdfViewer from "./viewer/PdfViewer";

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Dashboard />} />
        <Route path="/" element={<BackroomDashboard />} />
        <Route path="/permits/new_permit" element={<NewPermit />} />
        <Route path="/permits/renewal_permit" element={<RenewalPermit />} />
        <Route path="/zoning" element={<Zoning />} />
        <Route path="/viewer" element={<PdfViewer />} />

      </Routes>
    </Router>
  );
}

export default App; 