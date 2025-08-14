import React, { useState, useEffect } from 'react';
import { buildApiUrl } from '../config/api';
import './zoning.css';

export default function Zoning() {
  const [forms, setForms] = useState([]);

  // Fetch forms from backend
  const fetchForms = async () => {
    try {
      // The API endpoint should be built correctly to include the base path
      const res = await fetch(buildApiUrl('zoning/zoning-forms'));
      if (!res.ok) {
        console.error(`Error: ${res.status} ${res.statusText}`);
        setForms([]);
        return;
      }
      const data = await res.json();
      setForms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching zoning forms:', err);
      setForms([]);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  // Handle Approve / Disapprove
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(buildApiUrl(`zoning/zoning-forms/${id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }
      
      alert(`Status updated to ${status} successfully!`);
      fetchForms(); // Refresh table
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error updating status.');
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  return (
    <div className="zoning-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Zoning Forms</h2>
      </div>
      {forms.length === 0 ? (
        <p>No zoning forms found.</p>
      ) : (
        <div className="table-responsive">
          <table className="zoning-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Business Name</th>
                <th>Address</th>
                <th>Email</th>
                <th>Contact</th>
                <th>TIN</th>
                <th>Zoning Classification</th>
                <th>OBO Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {forms.map(form => (
                <tr key={form.id}>
                  <td>{form.id}</td>
                  <td>{form.business_name}</td>
                  <td>{form.business_address}</td>
                  <td>{form.email_address}</td>
                  <td>{form.contact_number}</td>
                  <td>{form.tin}</td>
                  <td>{form.zoning_classification}</td>
                  <td>{formatCurrency(form.obo_clearance_fee)}</td>
                  <td>{form.status}</td>
                  <td>
                    {form.status !== 'approved' && (
                      <button 
                        className="approve-btn" 
                        onClick={() => updateStatus(form.id, 'approved')}
                      >
                        Approve
                      </button>
                    )}
                    {form.status !== 'disapproved' && (
                      <button 
                        className="disapprove-btn" 
                        onClick={() => updateStatus(form.id, 'disapproved')}
                      >
                        Disapprove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}