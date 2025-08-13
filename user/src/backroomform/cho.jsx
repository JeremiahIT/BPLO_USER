import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../config/api';
import './cho.css';

export default function ContactForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailContact: '',
    businessName: '',
    businessAddress: '',
    taxIdentificationNumber: '',
    zoningClassification: '',
    choClearanceFee: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(buildApiUrl('/submit-contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      alert('Form submitted successfully!');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Error submitting form.');
    }
  };

  const handleBack = () => {
    navigate('/brdashboard');
  };

  return (
    <div className="form-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Business Contact & Compliance Form</h2>
        <button
          onClick={handleBack}
          className="back-button"
        >
          Back to Dashboard
        </button>
      </div>
      <div className="form-wrapper">
        <form className="form-content" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Contact No.:</label>
            <input
              type="email"
              name="emailContact"
              placeholder="Enter your email"
              value={formData.emailContact}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Business Name:</label>
            <input
              type="text"
              name="businessName"
              placeholder="Enter business name"
              value={formData.businessName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Business Address:</label>
            <input
              type="text"
              name="businessAddress"
              placeholder="Enter business address"
              value={formData.businessAddress}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Business Tax Identification Number (TIN):</label>
            <input
              type="text"
              name="taxIdentificationNumber"
              placeholder="Enter TIN"
              value={formData.taxIdentificationNumber}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Zoning Classification of Business Location:</label>
            <input
              type="text"
              name="zoningClassification"
              placeholder="Enter zoning classification"
              value={formData.zoningClassification}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cho Clearance Fee:</label>
            <input
              type="text"
              name="choClearanceFee"
              placeholder="Enter clearance fee details"
              value={formData.choClearanceFee}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="submit-button"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}