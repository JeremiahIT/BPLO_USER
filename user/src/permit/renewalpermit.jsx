import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../config/api';
import './renewalpermit.css';

/**
 * A component for the Renewal Permit form.
 * It handles the state for all form inputs, manages form submission,
 * and provides a dynamic and responsive user interface.
 */
const RenewalPermit = () => {
  const navigate = useNavigate();

  // State to hold all form data, including new fields
  const [form, setForm] = useState({
    businessName: '',
    businessAccountNumber: '', // New field for Business Account Number
    businessAddress: '',
    mailingAddress: '',         // New field for Mailing Address
    businessType: '',           // New field for Business Type
    sicCodeOrNaicsCode: '',     // New field for SIC/NAICS Code
    ownershipType: '',          // New field for Ownership Type
    ownerFullName: '',
    contactPhoneNumber: '',     // New field for Contact Phone Number
    emailAddress: '',           // Corresponds to the email in your list
    emergencyContactInformation: '' // Optional field
  });

  // State for messages to the user (success or error)
  const [message, setMessage] = useState({ text: '', type: '' });

  /**
   * Handles changes to all form input fields dynamically.
   * @param {object} e The event object from the input change.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  /**
   * Handles the form submission logic.
   * Replaced alert() with a state-based message system for better UX.
   * @param {object} e The event object from the form submission.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Replaced explicit field mapping with sending the entire 'form' object
    fetch(buildApiUrl('/renewals'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit renewal');
      }
      return res.json();
    })
    .then((data) => {
      setMessage({ text: 'Renewal submitted successfully!', type: 'success' });
      // Reset form after successful submission
      setForm({
        businessName: '',
        businessAccountNumber: '',
        businessAddress: '',
        mailingAddress: '',
        businessType: '',
        sicCodeOrNaicsCode: '',
        ownershipType: '',
        ownerFullName: '',
        contactPhoneNumber: '',
        emailAddress: '',
        emergencyContactInformation: ''
      });
      // You can navigate after a delay if needed
      // setTimeout(() => navigate('/'), 2000);
    })
    .catch((err) => {
      setMessage({ text: `Error: ${err.message}`, type: 'error' });
    });
  };

  return (
    <div className="renewal-form-container">
      <h2>Renewal Permit Application</h2>
      {/* Display messages based on state */}
      {message.text && (
        <div className={`form-message ${message.type}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="renewal-form">
        <h3>Business Information</h3>
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
          Business Account Number (BAN):
          <input
            type="text"
            name="businessAccountNumber"
            value={form.businessAccountNumber}
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
          Mailing Address:
          <input
            type="text"
            name="mailingAddress"
            value={form.mailingAddress}
            onChange={handleChange}
          />
        </label>
        <label>
          Business Type:
          <input
            type="text"
            name="businessType"
            value={form.businessType}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          SIC or NAICS Code:
          <input
            type="text"
            name="sicCodeOrNaicsCode"
            value={form.sicCodeOrNaicsCode}
            onChange={handleChange}
          />
        </label>
        <label>
          Ownership Type:
          <input
            type="text"
            name="ownershipType"
            value={form.ownershipType}
            onChange={handleChange}
            required
          />
        </label>
        
        <hr />
        
        <h3>Owner/Contact Information</h3>
        <label>
          Owner's Full Name:
          <input
            type="text"
            name="ownerFullName"
            value={form.ownerFullName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Contact Phone Number:
          <input
            type="tel"
            name="contactPhoneNumber"
            value={form.contactPhoneNumber}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email Address:
          <input
            type="email"
            name="emailAddress"
            value={form.emailAddress}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Emergency Contact (Optional):
          <input
            type="text"
            name="emergencyContactInformation"
            value={form.emergencyContactInformation}
            onChange={handleChange}
          />
        </label>
        
        <div className="renewal-form-actions">
          <button type="button" onClick={() => navigate('/')}>Back</button>
          <button type="submit" className="submit-btn">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default RenewalPermit;
