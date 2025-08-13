import React from 'react';
import './dashboard/dashboard.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard/dashboard';
import NewPermit from './permit/newpermit';
import RenewalPermit from './permit/renewalpermit';
import BackRoomDashBoard from './backroomdashboard/brdashboard';
import CHO from './backroomform/cho';
import OBO from './backroomform/obo';
import ElectricalForm from './backroomform/electrical';
import SolidWaste from './backroomform/solidwaste';
import Zoning from './backroomform/zoning';
import StatusPermit from './status/statuspermit';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/newpermit" element={<NewPermit />} />
        <Route path="/renewalpermit" element={<RenewalPermit />} />
        <Route path="/brdashboard" element={<BackRoomDashBoard />} />
        <Route path="/cho" element={<CHO />} />
        <Route path="/obo" element={<OBO />} />
        <Route path="/electrical" element={<ElectricalForm />} />
        <Route path="/solidwaste" element={<SolidWaste />} />
        <Route path="/zoning" element={<Zoning />} />
        <Route path="/statuspermit" element={<StatusPermit />} />



      </Routes>
    </Router>
  );
}

export default App;
