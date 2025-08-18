import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './newpermit.css';

// Constants for form options
const BUSINESS_TYPES = [
  'Sole Proprietor',
  'Partnership',
  'Corporation',
  'Cooperative',
];

const NewPermit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [form, setForm] = useState({
    // Section 1: Business Information
    businessName: '',
    businessAddress: '',
    businessType: '',
    natureOfBusiness: '',
    tin: '',
    
    // Section 2: Core Documents (File inputs)
    dtiCertificate: null,
    secCertificate: null,
    cdaCertificate: null,
    birCertificate: null,
    
    // Section 3: Contact Information
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    mailAddress: '',
    mobile: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Remove non-digits from TIN input for formatting
    if (name === 'tin') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length > 3 && numericValue.length <= 6) {
        formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
      } else if (numericValue.length > 6 && numericValue.length <= 9) {
        formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3, 6)}-${numericValue.slice(6)}`;
      } else if (numericValue.length > 9) {
        formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3, 6)}-${numericValue.slice(6, 9)}-${numericValue.slice(9, 12)}`;
      } else {
        formattedValue = numericValue;
      }
    }

    setForm((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    for (const key in form) {
      if (form[key] !== null) {
        formData.append(key, form[key]);
      }
    }

    try {
      console.log('Form data submitted:', form);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      setMessage({ text: 'Application submitted successfully!', type: 'success' });
      setForm({
        businessName: '', businessAddress: '', businessType: '', natureOfBusiness: '', tin: '',
        dtiCertificate: null, secCertificate: null, cdaCertificate: null, birCertificate: null,
        firstName: '', middleName: '', lastName: '', gender: '',
        mailAddress: '', mobile: '', email: '',
      });
      // In a real application, you would navigate after a successful submission
      // navigate('/dashboard');
    } catch (error) {
      console.error('Submit error:', error);
      setMessage({ text: `Error submitting application: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 5000); // Clear message after 5 seconds
    }
  };

  return (
    <div className="new-permit-container">
      <button
        type="button"
        className="back-dashboard-btn"
        onClick={() => navigate('/')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <form onSubmit={handleSubmit}>
        <h1 className="form-title">New Business Permit Application</h1>
        
        {message.text && (
          <div className={`message-box ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Section 1: Business Information */}
        <div className="form-section">
          <div className="section-title">Business Information</div>
          <div className="form-row">
            <div>
              <label>Business Name <span className="required">*</span></label>
              <input type="text" name="businessName" value={form.businessName} onChange={handleChange} required autoComplete="organization" />
            </div>
            <div>
              <label>Business Address <span className="required">*</span></label>
              <input type="text" name="businessAddress" value={form.businessAddress} onChange={handleChange} required autoComplete="street-address" />
            </div>
            <div>
              <label>Business Type <span className="required">*</span></label>
              <select name="businessType" value={form.businessType} onChange={handleChange} required>
                <option value="">Select Type</option>
                {BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Nature of Business / Industry <span className="required">*</span></label>
              <input type="text" name="natureOfBusiness" value={form.natureOfBusiness} onChange={handleChange} required />
            </div>
            <div>
              <label>Tax Identification No. (TIN)</label>
              <input 
                type="text" 
                name="tin" 
                value={form.tin} 
                onChange={handleChange} 
                placeholder="000-00-000-000"
                pattern="\d{3}-\d{2}-\d{3}-\d{3}" 
                title="TIN must be in the format 000-00-000-000"
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Core Documents */}
        <div className="form-section">
          <div className="section-title">Core Documents</div>
          <div className="form-row file-upload-row">
            <div>
              <label>DTI Certificate</label>
              <input type="file" name="dtiCertificate" onChange={handleFileChange} />
            </div>
            <div>
              <label>SEC Certificate</label>
              <input type="file" name="secCertificate" onChange={handleFileChange} />
            </div>
            <div>
              <label>CDA Certificate</label>
              <input type="file" name="cdaCertificate" onChange={handleFileChange} />
            </div>
            <div>
              <label>BIR Certificate of Registration (Form 2303)</label>
              <input type="file" name="birCertificate" onChange={handleFileChange} />
            </div>
          </div>
        </div>
        
        {/* Section 3: Contact Information */}
        <div className="form-section">
          <div className="section-title">Contact Information</div>
          <div className="form-row">
            <div>
              <label>First Name</label>
              <input type="text" name="firstName" value={form.firstName} onChange={handleChange} autoComplete="given-name" />
              </div>
              <div>
                <label>Middle Name</label>
                <input type="text" name="middleName" value={form.middleName} onChange={handleChange} autoComplete="additional-name" />
              </div>
              <div>
                <label>Last Name</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} autoComplete="family-name" />
              </div>
              <div>
                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div>
                <label>Email Address <span className="required">*</span></label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" />
              </div>
              <div>
                <label>Mobile Number <span className="required">*</span></label>
                <input 
                  type="tel" 
                  name="mobile" 
                  value={form.mobile} 
                  onChange={handleChange} 
                  required 
                  pattern="^\+639\d{9}$" 
                  placeholder="+63 9xx xxx xxxx"
                  title="Philippine mobile number format (+63 9xx xxx xxxx)"
                  autoComplete="tel" 
                />
              </div>
            </div>
          </div>
          
          <div className="button-container">
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    );
};

export default NewPermit;
