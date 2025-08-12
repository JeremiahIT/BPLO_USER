import React, { useState } from 'react';
import './zoning.css';
import { buildApiUrl } from '../config/api';

const ZoningApplication = () => {
  const navigate = window.history.pushState ? (url) => window.location.assign(url) : () => {};
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    gmail: '',
    areaAndLocation: '',
    typeOfProject: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const zoningData = {
        full_name: form.fullName,
        email: form.gmail,
        area_and_location: form.areaAndLocation,
        type_of_project: form.typeOfProject,
      };

      const zoningResponse = await fetch(buildApiUrl('/zoning'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zoningData),
      });

      if (!zoningResponse.ok) {
        const errorData = await zoningResponse.json();
        throw new Error(errorData.error || 'Failed to submit zoning application');
      }

      alert('Zoning application submitted successfully!');
      setForm({
        fullName: '',
        gmail: '',
        areaAndLocation: '',
        typeOfProject: '',
      });
      navigate('/');
    } catch (error) {
      console.error('Submit error:', error);
      alert(`Error submitting application: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="zoning-form-container">
      <button
        type="button"
        className="back-dashboard-btn"
        onClick={() => navigate('/')}
      >
        Back to Dashboard
      </button>
      <form onSubmit={handleSubmit}>
        <div className="zoning-section-title">Zoning Application</div>
        <div className="zoning-form-row">
          <div>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Gmail</label>
            <input
              type="email"
              name="gmail"
              value={form.gmail}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="zoning-form-row">
          <div>
            <label>Area and Location</label>
            <input
              type="text"
              name="areaAndLocation"
              value={form.areaAndLocation}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Type of Project</label>
            <input
              type="text"
              name="typeOfProject"
              value={form.typeOfProject}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="button-container">
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          <button type="button" onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ZoningApplication;