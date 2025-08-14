import React from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import "./dashboard.css"; // The CSS file is in the same directory, so this path is correct.

export default function Dashboard() {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar" role="navigation" aria-label="Main Navigation">
        <nav>
          <ul>
            <li><Link to="/permits/new_permit">New Permit</Link></li>
            <li><Link to="/permits/renewal_permit">Renewal Permit</Link></li>
            <li><Link to="/Backroom/brdashboard">Backroom</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content" role="main">

        {/* New Analytics Section */}
        <section id="analytics-overview">
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3 className="analytics-title">No. of Population</h3>
              <p className="analytics-value">120,456</p>
            </div>
            <div className="analytics-card">
              <h3 className="analytics-title">No. of Businesses</h3>
              <p className="analytics-value">2,145</p>
            </div>
            <div className="analytics-card">
              <h3 className="analytics-title">No. of Employees</h3>
              <p className="analytics-value">55,789</p>
            </div>
            <div className="analytics-card">
              <h3 className="analytics-title">No. of Available Lots</h3>
              <p className="analytics-value">345</p>
            </div>
          </div>
        </section>

        <section id="overview">
          <p>Welcome to your dashboard! Select an option from the sidebar.</p>
        </section>
      </main>
    </div>
  );
}
