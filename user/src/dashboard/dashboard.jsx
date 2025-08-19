import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  // ✅ Check JWT token when Dashboard loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login'); // If no token, redirect
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <span className={`hamburger ${isSidebarOpen ? 'open' : ''}`}>
              <span></span><span></span><span></span>
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
          <button className="sidebar-btn logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-container">
        <div className="dashboard-header">
          <button className="mobile-toggle" onClick={toggleSidebar}>
            <span className={`hamburger ${isSidebarOpen ? 'open' : ''}`}>
              <span></span><span></span><span></span>
            </span>
          </button>
        </div>

        <div className="dashboard-content">
          <h1 className="dashboard-welcome-title">
            Welcome {user ? user.username : ''} 🎉
          </h1>
          <p className="dashboard-intro-text">
            This is your central hub for managing business permits and related tasks.
            Use the navigation buttons on the side to get started.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
