import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './renewal_permit.css';
import { buildApiUrl } from '../config/api';

function RenewalPermit() {
  const navigate = useNavigate();
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRenewals = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(buildApiUrl('/renewals'));
      if (!res.ok) throw new Error(`Failed to load renewals (${res.status})`);
      const data = await res.json();
      setRenewals(Array.isArray(data.renewals) ? data.renewals : []);
    } catch (err) {
      setError(err.message || 'Failed to load renewals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRenewals();
    const interval = setInterval(fetchRenewals, 20000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (value) => {
    if (!value) return '-';
    try { return new Date(value).toLocaleString(); } catch { return String(value); }
  };

  return (
    <div className="container">
      <button className="backButton" onClick={() => navigate('/')}>Back</button>

      <div className="headerRow">
        <h2>Renewal Permits</h2>
        <div className="actions">
          <button className="refreshButton" onClick={fetchRenewals} disabled={loading}>
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && <div className="errorBox">{error}</div>}

      <div className="tableContainer">
        <table className="dataTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Business Name</th>
              <th>Business Address</th>
              <th>Owner Name</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {renewals.length === 0 && !loading ? (
              <tr>
                <td colSpan={5} className="emptyCell">No renewal records found</td>
              </tr>
            ) : (
              renewals.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.b_name || '-'}</td>
                  <td>{r.b_address || '-'}</td>
                  <td>{r.owner_name || '-'}</td>
                  <td>{formatDate(r.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RenewalPermit;