import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import {
  FileText,
  Briefcase,
  Users,
  CheckCircle,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";
import Tax from "../TaxComputation/Tax";
import Examiners from "../ExaminersDivision/Examiners";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">GOV-PH</div>
        <nav className="sidebar-nav">
          <NavLink
            to="/tax"
            className={({ isActive }) =>
              `sidebar-button ${isActive ? "active" : ""}`
            }
          >
            <FileText className="sidebar-icon" />
            <span className="sidebar-text">Business Tax</span>
          </NavLink>
          <NavLink
            to="/examiners"
            className={({ isActive }) =>
              `sidebar-button ${isActive ? "active" : ""}`
            }
          >
            <Briefcase className="sidebar-icon" />
            <span className="sidebar-text">Examiner's Division</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          {/* Dashboard default view */}
          <Route
            path="/"
            element={
              <div className="analytics-grid">
                <div className="analytics-card">
                  <Users className="analytics-icon" />
                  <h3>Total Businesses</h3>
                  <p>120</p>
                </div>
                <div className="analytics-card">
                  <ClipboardList className="analytics-icon" />
                  <h3>Pending Taxes</h3>
                  <p>45</p>
                </div>
                <div className="analytics-card">
                  <CheckCircle className="analytics-icon" />
                  <h3>Approved Applications</h3>
                  <p>300</p>
                </div>
                <div className="analytics-card">
                  <AlertTriangle className="analytics-icon" />
                  <h3>Rejected Applications</h3>
                  <p>15</p>
                </div>
              </div>
            }
          />
          {/* Subpages */}
          <Route path="/Tax" element={<Tax />} />
          <Route path="/Examiners" element={<Examiners />} />
        </Routes>
      </main>
    </div>
  );
}

export default Dashboard;
