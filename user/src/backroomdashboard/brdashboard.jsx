import React from 'react';
import { useNavigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './brdashboard.css';

// The main BrDashboard component
export default function BrDashboard() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="brdashboard-container">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate('/')}>
        &larr; Back
      </button>

      {/* Page Title */}
      <h1 className="brdashboard-title">Backroom Dashboard</h1>

      {/* Grid of Buttons */}
      <div className="button-grid">
        <div className="box-button" onClick={() => handleNavigation('/cho')}>City Health Office</div>
        <div className="box-button" onClick={() => handleNavigation('/electrical')}>Electrical Application</div>
        <div className="box-button" onClick={() => handleNavigation('/obo')}>Office of the build</div>
        <div className="box-button" onClick={() => handleNavigation('/solidwaste')}>Solid Waste Management</div>
        <div className="box-button" onClick={() => handleNavigation('/zoning')}>Zoning Area</div>
      </div>
    </div>
  );
}

// A placeholder for the App component to make the example runnable
const Dashboard = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-8">
            <h1 className="text-5xl font-extrabold text-blue-600 mb-6">Main Dashboard</h1>
            <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-xl transition-colors duration-200"
                onClick={() => navigate('/Backroom/brdashboard')}
            >
                Go to Backroom
            </button>
        </div>
    );
};

export function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/Backroom/brdashboard" element={<BrDashboard />} />
                <Route path="/cho" element={<div>City Health Office Page</div>} />
                <Route path="/electrical" element={<div>Electrical Application Page</div>} />
                <Route path="/obo" element={<div>Office of the build Page</div>} />
                <Route path="/solidwaste" element={<div>Solid Waste Management Page</div>} />
                <Route path="/zoning" element={<div>Zoning Area Page</div>} />
            </Routes>
        </Router>
    );
}

