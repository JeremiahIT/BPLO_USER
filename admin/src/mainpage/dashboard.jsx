import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './dashboard.css';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard">
      {/* Mobile toggle button */}
      <button className="menu-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2 className="logo">My Dashboard</h2>
        <nav>
          <ul>
            <li><Link to="/" onClick={toggleSidebar}>🏠 Home</Link></li>
            <li><Link to="/permits/new_permit" onClick={toggleSidebar}>🆕 New Permit</Link></li>
            <li><Link to="/permits/renewal_permit" onClick={toggleSidebar}>♻️ Renewal Permit</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <Outlet /> {/* Shows nested routes */}
      </main>
    </div>
  );
}

export default Dashboard;
