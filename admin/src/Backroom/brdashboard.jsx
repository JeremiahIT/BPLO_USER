import React from 'react';
import { useNavigate } from 'react-router-dom';
import './brdashboard.css'; // The correct path for CSS in the same directory

export default function BrDashboard() {
  const navigate = useNavigate();

  return (
    <div className="br-container">
      {/* Sidebar Navigation */}
      <aside className="br-sidebar">
        <h2 className="br-title">Backroom Offices</h2>
        <nav className="br-nav">
          <ul>
            <li>
              <button className="br-nav-button" onClick={() => navigate('/cho')}>
                CHO
              </button>
            </li>
            <li>
              <button className="br-nav-button" onClick={() => navigate('/obo')}>
                OBO
              </button>
            </li>
            <li>
              <button className="br-nav-button" onClick={() => navigate('/electrical')}>
                Electrical
              </button>
            </li>
            <li>
              <button className="br-nav-button" onClick={() => navigate('/solidwaste')}>
                Solid Waste
              </button>
            </li>
            <li>
              <button className="br-nav-button" onClick={() => navigate('/zoning')}>
                Zoning
              </button>
            </li>
          </ul>
        </nav>
        <button className="br-back-button" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="br-main-content">
        <h1 className="br-main-heading">Welcome to the Backroom Offices Portal</h1>
        <p className="br-main-text">
          Select an office from the sidebar to continue.
        </p>
      </main>
    </div>
  );
}
