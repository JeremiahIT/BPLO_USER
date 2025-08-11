import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./new_permit.css";
import { buildApiUrl } from "../config/api";

function NewPermit() {
  const navigate = useNavigate();
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPermits = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(buildApiUrl('/permits'));
      if (!res.ok) {
        throw new Error(`Failed to load permits (${res.status})`);
      }
      const data = await res.json();
      setPermits(Array.isArray(data.permits) ? data.permits : []);
    } catch (err) {
      setError(err.message || 'Failed to load permits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermits();
    const interval = setInterval(fetchPermits, 20000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (value) => {
    if (!value) return '-';
    try {
      return new Date(value).toLocaleString();
    } catch {
      return String(value);
    }
  };

  const buildOwnerName = (p) => {
    const parts = [p.owner_first_name, p.owner_middle_name, p.owner_last_name, p.owner_extension_name]
      .filter(Boolean);
    return parts.join(' ');
  };

  return (
    <div className="container">
      <button className="backButton" onClick={() => navigate("/")}>Back</button>

      <div className="headerRow">
        <h2>New Permits</h2>
        <div className="actions">
          <button className="refreshButton" onClick={fetchPermits} disabled={loading}>
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && <div className="errorBox">{error}</div>}

      <div className="tableContainer">
        <table className="dataTable">
          <thead>
            <tr>
              <th>Permit No.</th>
              <th>Business Name</th>
              <th>Business Type</th>
              <th>Owner Name</th>
              <th>Telephone</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {permits.length === 0 && !loading ? (
              <tr>
                <td colSpan={8} className="emptyCell">No permits found</td>
              </tr>
            ) : (
              permits.map((p) => (
                <tr key={p.id}>
                  <td>{p.permit_number || '-'}</td>
                  <td>{p.business_name || '-'}</td>
                  <td>{p.business_type || '-'}</td>
                  <td>{buildOwnerName(p) || '-'}</td>
                  <td>{p.telephone || '-'}</td>
                  <td>{p.mobile || '-'}</td>
                  <td>{p.status || 'pending'}</td>
                  <td>{formatDate(p.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NewPermit;
