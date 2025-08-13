import React from 'react';  
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from "./mainpage/dashboard";
import NewPermit from "./permits/new_permit";
import RenewalPermit from "./permits/renewal_permit";
import CHO from './Backroom/cho';
import OBO from './Backroom/obo';
import ElectricalForm from './Backroom/electrical';
import SolidWaste from '.Backroom/solidwaste';
import Zoning from './Backroom/zoning';
import BackroomDashboard from './Backroom/brdashboard';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Dashboard />} />
        <Route path="/" element={<BackroomDashboard />} />
        <Route path="/permits/new_permit" element={<NewPermit />} />
        <Route path="/permits/renewal_permit" element={<RenewalPermit />} />
        <Route path="/cho" element={<CHO />} />
        <Route path="/obo" element={<OBO />} />
        <Route path="/electrical" element={<ElectricalForm />} />
        <Route path="/solidwaste" element={<SolidWaste />} />
        <Route path="/zoning" element={<Zoning />} />

      </Routes>
    </Router>
  );
}

export default App; 