import React from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../config/api';
import './brdashboard.css';

export default function BrDashboard() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard'); // Go back to dashboard route
  };

  const handleClick = (buttonName) => {
    alert(`You clicked ${buttonName}`);
  };

  return (
    <div className="brdashboard">
      <h1>Business Records Dashboard</h1>

      <div className="button-grid">
        <button onClick={() => handleClick('Button 1')}>Button 1</button>
        <button onClick={() => handleClick('Button 2')}>Button 2</button>
        <button onClick={() => handleClick('Button 3')}>Button 3</button>
        <button onClick={() => handleClick('Button 4')}>Button 4</button>
        <button onClick={() => handleClick('Button 5')}>Button 5</button>
      </div>

      <button className="back-button" onClick={handleBack}>
        ← Back to Dashboard
      </button>
    </div>
  );
}
