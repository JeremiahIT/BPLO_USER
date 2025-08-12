import React from 'react';
import { useNavigate } from 'react-router-dom';
import './brdashboard.css';

export default function BrDashboard() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="brdashboard-container">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back
      </button>

      {/* Grid of Buttons */}
      <div className="button-grid">
        <div className="box-button" onClick={() => handleNavigation('/cho')}>City Health Office</div>
        <div className="box-button" onClick={() => handleNavigation('/electrical')}>Electrical Application</div>
        <div className="box-button" onClick={() => handleNavigation('/obo')}>Office of the build</div>
        <div className="box-button" onClick={() => handleNavigation('/solidwaste')}>Solid Waste Management</div>
        <div className="box-button" onClick={() => handleNavigation('/zoning')}>Zoning Area</div>
        <div className="box-button" onClick={() => handleNavigation('/page6')}>Page 6</div>
      </div>
    </div>
  );
}
