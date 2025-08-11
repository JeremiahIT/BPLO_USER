import React, { useState } from 'react';
import './newpermit.css';
import { buildApiUrl } from '../config/api';

const businessTypes = [
  'COOPERATIVE',
  'CORPORATION',
  'ONE PERSON CORPORATION',
  'PARTNERSHIP',
  'SOLE PROPRIETORSHIP',
];

const NewPermit = () => {
  const navigate = window.history.pushState ? (url) => window.location.assign(url) : () => {};
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessType: '',
    registrationNo: '',
    businessName: '',
    tin: '',
    tradeName: '',
    firstName: '',
    middleName: '',
    lastName: '',
    extensionName: '',
    sex: '',
    mailAddress: '',
    telephone: '',
    mobile: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const permitData = {
        business_type: form.businessType,
        registration_number: form.registrationNo || '',
        business_name: form.businessName,
        tax_identification_number: form.tin || '',
        trade_name: form.tradeName || '',
        owner_first_name: form.firstName || '',
        owner_middle_name: form.middleName || '',
        owner_last_name: form.lastName || '',
        owner_extension_name: form.extensionName || '',
        owner_sex: form.sex || '',
        mail_address: form.mailAddress || '',
        telephone: form.telephone || '',
        mobile: form.mobile || '',
      };

      const permitResponse = await fetch(buildApiUrl('/permits'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(permitData),
      });

      if (!permitResponse.ok) {
        const errorData = await permitResponse.json();
        throw new Error(errorData.error || 'Failed to create permit');
      }

      alert('Permit submitted successfully!');
      setForm({
        businessType: '',
        registrationNo: '',
        businessName: '',
        tin: '',
        tradeName: '',
        firstName: '',
        middleName: '',
        lastName: '',
        extensionName: '',
        sex: '',
        mailAddress: '',
        telephone: '',
        mobile: '',
      });
      navigate('/');

    } catch (error) {
      console.error('Submit error:', error);
      alert(`Error submitting permit: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="permit-form-container">
      <button
        type="button"
        className="back-dashboard-btn"
        onClick={() => navigate('/')}
      >
        Back to Dashboard
      </button>
      <form onSubmit={handleSubmit}>
        <div className="permit-section-title">Business Information Registration</div>
        <div className="permit-form-row">
          <div>
            <label>Business Type <span style={{ color: 'red' }}>*</span></label>
            <select name="businessType" value={form.businessType} onChange={handleChange} required>
              <option value="">Select Type</option>
              {businessTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label>DTI/SEC/CDA Registration No.</label>
            <input name="registrationNo" value={form.registrationNo || ''} onChange={handleChange} autoComplete="off" />
          </div>
        </div>
        <div className="permit-form-row">
          <div>
            <label>Business Name <span style={{ color: 'red' }}>*</span></label>
            <input name="businessName" value={form.businessName} onChange={handleChange} required autoComplete="organization" />
          </div>
          <div>
            <label>Tax Identification No.</label>
            <input name="tin" value={form.tin || ''} onChange={handleChange} autoComplete="off" />
          </div>
        </div>
        <div className="permit-form-row">
          <div>
            <label>Trade Name/Franchise (if applicable)</label>
            <input name="tradeName" value={form.tradeName || ''} onChange={handleChange} autoComplete="off" />
          </div>
          <div>
            <label>First Name</label>
            <input name="firstName" value={form.firstName || ''} onChange={handleChange} autoComplete="given-name" />
          </div>
          <div>
            <label>Middle Name</label>
            <input name="middleName" value={form.middleName || ''} onChange={handleChange} autoComplete="additional-name" />
          </div>
          <div>
            <label>Last Name</label>
            <input name="lastName" value={form.lastName || ''} onChange={handleChange} autoComplete="family-name" />
          </div>
          <div>
            <label>Extension Name</label>
            <input name="extensionName" value={form.extensionName || ''} onChange={handleChange} autoComplete="off" />
          </div>
          <div>
            <label>Sex</label>
            <select name="sex" value={form.sex || ''} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <div className="permit-section-title">Contact Information</div>
        <div className="permit-form-row">
          <div>
            <label>Mail Address</label>
            <input name="mailAddress" value={form.mailAddress || ''} onChange={handleChange} autoComplete="street-address" />
          </div>
          <div>
            <label>Telephone Number</label>
            <input name="telephone" value={form.telephone || ''} onChange={handleChange} autoComplete="tel" />
          </div>
          <div>
            <label>Mobile Number</label>
            <input name="mobile" value={form.mobile || ''} onChange={handleChange} autoComplete="tel" />
          </div>
        </div>
        <div className="button-container">
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          <button type="button">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default NewPermit;
