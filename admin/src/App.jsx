import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './mainpage/dashboard';
import NewPermit from "./permits/new_permit";

function HomePage() {
  return <h2>Home Page</h2>;
}

function RenewalPermit() {
  return <h2>Renewal Permit Page</h2>;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes that have the Dashboard layout */}
        <Route path="/" element={<Dashboard />}>
          <Route index element={<HomePage />} />
          <Route path="permits/renewal_permit" element={<RenewalPermit />} />
        </Route>

        {/* Route WITHOUT the Dashboard (only back button will be in NewPermit) */}
        <Route path="/permits/new_permit" element={<NewPermit />} />
      </Routes>
    </Router>
  );
}

export default App;
