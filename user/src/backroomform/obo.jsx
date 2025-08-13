import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../config/api';
import './obo.css';

export default function OboForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
    taxIdentificationNumber: '',
    emailAddress: '',
    contactNo: '',
    zoningClassification: '',
    oboClearanceFee: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(buildApiUrl('/obo/submit-obo'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      alert('OBO form submitted successfully!');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Error submitting OBO form.');
    }
  };

  const handleBack = () => {
    navigate('/brdashboard');
  };

  return (
    <div className="obo-form-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">OBO Permit Form</h2>
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
            <label className="form-label">Email Address:</label>
            <input
              type="email"
              name="emailAddress"
              placeholder="Enter email address"
              value={formData.emailAddress}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact No.:</label>
            <input
              type="tel"
              name="contactNo"
              placeholder="Enter contact number"
              value={formData.contactNo}
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
            <label className="form-label">OBO Clearance Fee:</label>
            <input
              type="text"
              name="oboClearanceFee"
              placeholder="Enter clearance fee details"
              value={formData.oboClearanceFee}
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