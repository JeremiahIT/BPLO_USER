import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeModal, setActiveModal] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openModal = (modalId) => {
    setActiveModal(modalId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const dashboardBoxes = [
    { id: 'box1', title: 'Operation Time', description: 'View business operation hours and schedule' },
    { id: 'box2', title: 'Renewal Requirements', description: 'Handle permit renewals and extensions' },
    { id: 'box3', title: 'Permit Requirements', description: 'View and manage permit requirements' },
    { id: 'box4', title: 'Reports', description: 'Generate and view business reports' }
  ];

  return (
    <div className="dashboard-layout">
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <span className={`hamburger ${isSidebarOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
        <div className="sidebar-content">
          <button className="sidebar-btn" onClick={() => navigate('/newpermit')}>
            New Business Permit
          </button>
          <button className="sidebar-btn" onClick={() => navigate('/renewalpermit')}>
            Renewal Permit
          </button>
        </div>
      </aside>
      <main className="dashboard-container">
        <div className="dashboard-header">
          <button className="mobile-toggle" onClick={toggleSidebar}>
            <span className={`hamburger ${isSidebarOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
        <div className="dashboard-title">Welcome! </div>
        
        <div className="dashboard-grid">
          {dashboardBoxes.map((box) => (
            <div
              key={box.id}
              className="dashboard-box"
              onClick={() => openModal(box.id)}
            >
              <div className="box-content">
                <h3 className="box-title">{box.title}</h3>
                <p className="box-description">{box.description}</p>
                <div className="box-icon">📋</div>
              </div>
            </div>
          ))}
        </div>

            {/* Analytics Section */}
        <section className="analytics-section">
          <h2 className="section-subtitle">Analytics</h2>
          <div className="analytics-grid">
            <div className="analytics-card">
              <div className="analytics-content">
                <span className="analytics-label">No. of Population</span>
                <span className="analytics-value">0</span>
              </div>
              <div className="analytics-icon" aria-hidden>
                👥
              </div>
            </div>
            <div className="analytics-card">
              <div className="analytics-content">
                <span className="analytics-label">Available Lots in San Pablo</span>
                <span className="analytics-value">0</span>
              </div>
              <div className="analytics-icon" aria-hidden>
                📍
              </div>
            </div>
          </div>
        </section>

        {/* Modal Overlay */}
        {activeModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {dashboardBoxes.find(box => box.id === activeModal)?.title}
                </h2>
                <button className="modal-close" onClick={closeModal}>
                  <span className="close-icon">×</span>
                </button>
              </div>
              <div className="modal-body">
                {activeModal === 'box1' && (
                  <div className="operation-time-info">
                    <div className="operation-time-details">
                      <p className="operation-days">Monday to Friday</p>
                      <p className="operation-hours">8am to 5pm</p>
                    </div>
                  </div>
                )}
                
                {activeModal === 'box2' && (
                  <div className="requirements-info">
                    <div className="requirements-list">
                      <ul>
                        <li>Community Tax Certificate</li>
                        <li>Barangay Clearance for the current year</li>
                        <li>Previous Year's Business Permit</li>
                        <li>Financial Documents</li>
                        <li>Community Tax Certificate</li>
                      </ul>
                    </div>
                  </div>
                )}
                
                {activeModal === 'box3' && (
                  <div className="requirements-info">
                    <div className="requirements-list">
                      <ul>
                        <li>Barangay Clearance</li>
                        <li>Proof of Business Address</li>
                        <li>Business Name Registration Certificate</li>
                        <li>Community Tax Certificate</li>
                        <li>Locational/Zoning Clearance</li>
                        <li>Fire Safety Inspection Certificate</li>
                      </ul>
                    </div>
                  </div>
                )}
                
                {activeModal === 'box4' && (
                  <>
                    <p className="modal-text">Sample text</p>
                    <p className="modal-description">
                      This is a sample description for the Reports section. 
                      Here you can add more detailed information about this feature.
                    </p>
                  </>
                )}
              </div>
              <div className="modal-footer">
                {/* Removed back button - only close button in header */}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
