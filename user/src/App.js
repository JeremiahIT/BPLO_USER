import React from 'react';
import './dashboard/dashboard.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard/dashboard';
import NewPermit from './permit/newpermit';
import RenewalPermit from './permit/renewalpermit';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/newpermit" element={<NewPermit />} />
        <Route path="/renewalpermit" element={<RenewalPermit />} />
      </Routes>
    </Router>
  );
}

export default App;
