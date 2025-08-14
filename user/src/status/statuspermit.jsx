import React, { useState, useEffect } from 'react';
import { buildApiUrl } from '../config/api';
import './statuspermit.css';

export default function StatusPermit() {
  // 🌟 Initialize state to hold the zoning forms data 🌟
  const [zoningForms, setZoningForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🌟 Create a function to fetch the data from the backend 🌟
  const fetchZoningForms = async () => {
    try {
      setLoading(true);
      const res = await fetch(buildApiUrl('zoning/zoning-forms'));
      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setZoningForms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching zoning forms:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🌟 Use useEffect to call the fetch function when the component mounts 🌟
  useEffect(() => {
    fetchZoningForms();
  }, []);

  return (
    <div className="status-permit">
      <h1>Business Permit Status</h1>
      {loading && <p>Loading data...</p>}
      {error && <p className="error">Error: {error}</p>}
      
      {!loading && !error && zoningForms.length === 0 && (
        <p>No zoning forms found.</p>
      )}

      {!loading && !error && zoningForms.length > 0 && (
        // 🌟 Render a table to display the fetched data 🌟
        <div className="table-responsive">
          <table className="status-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Business Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {zoningForms.map(form => (
                <tr key={form.id}>
                  <td>{form.id}</td>
                  <td>{form.business_name}</td>
                  <td>{form.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}