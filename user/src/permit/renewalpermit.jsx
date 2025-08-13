import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../config/api';
import './renewalpermit.css';

const RenewalPermit = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    businessName: '',
    businessAddress: '',
    ownerFullName: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit to backend
    fetch(buildApiUrl('/renewals'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        b_name: form.businessName,
        b_address: form.businessAddress,
        owner_name: form.ownerFullName
      })
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to submit renewal');
        }
        return res.json();
      })
      .then((data) => {
        alert('Renewal submitted successfully!');
        setForm({ businessName: '', businessAddress: '', ownerFullName: '' });
        navigate('/');
      })
      .catch((err) => {
        alert(`Error: ${err.message}`);
      });
  };

  return (
    <div className="renewal-form-container">
      <h2>Renewal Permit</h2>
      <form onSubmit={handleSubmit} className="renewal-form">
        <label>
          Business Name:
          <input
            type="text"
            name="businessName"
            value={form.businessName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Business Address:
          <input
            type="text"
            name="businessAddress"
            value={form.businessAddress}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Owner Full Name:
          <input
            type="text"
            name="ownerFullName"
            value={form.ownerFullName}
            onChange={handleChange}
            required
          />
        </label>
        <div className="renewal-form-actions">
          <button type="button" onClick={() => navigate('/')}>Back</button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default RenewalPermit;
