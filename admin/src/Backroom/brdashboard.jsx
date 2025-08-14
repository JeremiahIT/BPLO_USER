import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { buildApiUrl } from '../config/api';
import './brdashboard.css';

export default function BrDashboard() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/'); // Go back to dashboard route
  };

  // const handleClick = (buttonName) => {
  //   alert(`You clicked ${buttonName}`);
  // };

  return (
    <div className="brdashboard">
      <h1>Business Records Dashboard</h1>

      <div className="button-grid">
        <button onClick={() => navigate('/cho')}>CHO</button>
        <button onClick={() => navigate('/obo')}>OBO</button>
        <button onClick={() => navigate('/electrical')}>Electrical</button>
        <button onClick={() => navigate('/solidwaste')}>Solid Waste</button>
        <button onClick={() => navigate('/zoning')}>Zoning</button>
      </div>

      <button className="back-button" onClick={handleBack}>
        ← Back to Dashboard
      </button>
    </div>
  );
}
