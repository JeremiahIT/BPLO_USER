import React from 'react';  
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from "./mainpage/dashboard";
import NewPermit from "./permits/new_permit";
import RenewalPermit from "./permits/renewal_permit";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/permits/new_permit" element={<NewPermit />} />
        <Route path="/permits/renewal_permit" element={<RenewalPermit />} />
      </Routes>
    </Router>
  );
}

export default App; 