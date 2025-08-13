import React from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import "./dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar" role="navigation" aria-label="Main Navigation">
        <h2 className="logo">MyApp</h2>
        <nav>
          <ul>
            <li><Link to="/permits/new_permit">New Permit</Link></li>
            <li><Link to="/permits/renewal_permit">Renewal Permit</Link></li>
            <li><Link to="/permits/renewal_permit">Backroom</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content" role="main">
        <header>
          <h1>Dashboard</h1>
        </header>
        <section id="overview">
          <p>Welcome to your dashboard! Select an option from the sidebar.</p>
        </section>
      </main>
    </div>
  );
}