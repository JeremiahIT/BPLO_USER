import React from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
=======
import { buildApiUrl } from '../config/api';
>>>>>>> c7e4b8da6c783ac05068fc06385d37c0dfc612b4
import './brdashboard.css';

export default function BrDashboard() {
  const navigate = useNavigate();

<<<<<<< HEAD
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
=======
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
>>>>>>> c7e4b8da6c783ac05068fc06385d37c0dfc612b4
        ← Back to Dashboard
      </button>
    </div>
  );
}
