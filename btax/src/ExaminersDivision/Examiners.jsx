import React from 'react';
import { useNavigate } from 'react-router-dom';  // ✅ import hook
import { ArrowLeft } from 'lucide-react';        // ✅ back icon
import './Examiners.css';

// Component for the Examiner's Division page.
function Examiners() {
  const navigate = useNavigate();

  return (
    <div className="content-page">
      <button 
        className="back-button" 
        onClick={() => navigate(-1)}   // ✅ Go back to previous page
      >
        <ArrowLeft size={16} style={{ marginRight: '6px' }} />
        Back
      </button>

      <h2 className="content-tiwwle">Examiner's Division</h2>
      <div className="content-card">
        <h3 className="card-title">Examiner's Work Queue</h3>
      </div>
    </div>
  );
}

export default Examiners;
