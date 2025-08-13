import React from 'react';
import { useNavigate } from 'react-router-dom';
import './brdashboard.css';

export default function BrDashboard() {
  const navigate = useNavigate();

  return (
    <div className="brdashboard">

      <div className="button-grid">
        <button onClick={() => navigate('/cho')}>CHO</button>
        <button onClick={() => navigate('/obo')}>OBO</button>
        <button onClick={() => navigate('/electrical')}>Electrical</button>
        <button onClick={() => navigate('/solidwaste')}>Solid Waste</button>
        <button onClick={() => navigate('/zoning')}>Zoning</button>
      </div>

      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>
    </div>
  );
}
