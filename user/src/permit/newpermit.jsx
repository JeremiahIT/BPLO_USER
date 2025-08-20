import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./newpermit.css";

const BUSINESS_TYPES = [
  "Sole Proprietor",
  "Partnership",
  "Corporation",
  "Cooperative",
];

const NewPermit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [form, setForm] = useState({
    businessName: "",
    businessAddress: "",
    businessType: "",
    natureOfBusiness: "",
    tin: "",
    dtiCertificate: null,
    secCertificate: null,
    cdaCertificate: null,
    birCertificate: null,
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    mailAddress: "",
    mobile: "+63",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format TIN (000-00-0000-)
    if (name === "tin") {
      const numeric = value.replace(/\D/g, "");
      if (numeric.length > 5) {
        formattedValue = `${numeric.slice(0,3)}-${numeric.slice(3,5)}-${numeric.slice(5,9)}`;
      } else if (numeric.length > 3) {
        formattedValue = `${numeric.slice(0,3)}-${numeric.slice(3)}`;
      } else {
        formattedValue = numeric;
      }
    }

    // Format Mobile Number (+639XXXXXXXXX)
    if (name === "mobile") {
      let numeric = value.replace(/\D/g, ""); // only digits
      if (numeric.startsWith("63")) numeric = numeric.slice(2); 
      else if (numeric.startsWith("0")) numeric = numeric.slice(1); 
      if (numeric.length > 10) numeric = numeric.slice(0, 10); // limit to 10 digits
      formattedValue = "+63" + numeric;
    }

    setForm((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0)
      setForm((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const formData = new FormData();

      // Map frontend form fields to backend expected fields
      formData.append("business_type", form.businessType);
      formData.append("registration_number", form.businessAddress);
      formData.append("business_name", form.businessName);
      formData.append("tax_identification_number", form.tin);
      formData.append("trade_name", form.natureOfBusiness);
      formData.append("owner_first_name", form.firstName);
      formData.append("owner_middle_name", form.middleName);
      formData.append("owner_last_name", form.lastName);
      formData.append("owner_sex", form.gender);
      formData.append("mail_address", form.mailAddress);
      formData.append("telephone", "");
      formData.append("mobile", form.mobile);
      formData.append("email", form.email);

      // Append files if they exist
      if (form.dtiCertificate) formData.append("dtiCertificate", form.dtiCertificate);
      if (form.secCertificate) formData.append("secCertificate", form.secCertificate);
      if (form.cdaCertificate) formData.append("cdaCertificate", form.cdaCertificate);
      if (form.birCertificate) formData.append("birCertificate", form.birCertificate);

      // Debug: Log form data
      console.log("Submitting form data:"); 
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await fetch("https://bplo-user.onrender.com/api/permits", {
        method: "POST",
        body: formData,
      });

      // Get detailed error information
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Server error response:", errorData);
        throw new Error(`Failed to submit application: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Success:", data);

      setMessage({ text: "Application submitted successfully!", type: "success" });

      // Reset form
      setForm({
        businessName: "",
        businessAddress: "",
        businessType: "",
        natureOfBusiness: "",
        tin: "",
        dtiCertificate: null,
        secCertificate: null,
        cdaCertificate: null,
        birCertificate: null,
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        mailAddress: "",
        mobile: "+63",
        email: "",
      });

    } catch (err) {
      console.error("Submission error:", err);
      setMessage({ 
        text: `Error: ${err.message || "Failed to submit application"}`,
        type: "error" 
      });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    }
  };

  return (
    <div className="permit-container">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        &larr; Back
      </button>
      <form className="permit-form" onSubmit={handleSubmit}>
        <h1 className="form-title">New Business Permit Application</h1>
        {message.text && (
          <div className={`message-box ${message.type}`}>{message.text}</div>
        )}

        {/* Business Information */}
        <fieldset>
          <legend>Business Information</legend>
          <div className="grid">
            <div>
              <label>Business Name <span>*</span></label>
              <input type="text" name="businessName" value={form.businessName} onChange={handleChange} required />
            </div>
            <div>
              <label>Business Address <span>*</span></label>
              <input type="text" name="businessAddress" value={form.businessAddress} onChange={handleChange} required />
            </div>
            <div>
              <label>Business Type <span>*</span></label>
              <select name="businessType" value={form.businessType} onChange={handleChange} required>
                <option value="">Select Type</option>
                {BUSINESS_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label>Nature of Business <span>*</span></label>
              <input type="text" name="natureOfBusiness" value={form.natureOfBusiness} onChange={handleChange} required />
            </div>
            <div>
              <label>TIN</label>
              <input type="text" name="tin" value={form.tin} onChange={handleChange} placeholder="000-00-0000" pattern="\d{3}-\d{2}-\d{4}" />
            </div>
          </div>
        </fieldset>

        {/* Core Documents */}
        <fieldset>
          <legend>Core Documents</legend>
          <div className="grid files">
            <div>
              <label>DTI Certificate</label>
              <input type="file" name="dtiCertificate" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
            </div>
            <div>
              <label>SEC Certificate</label>
              <input type="file" name="secCertificate" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
            </div>
            <div>
              <label>CDA Certificate</label>
              <input type="file" name="cdaCertificate" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
            </div>
            <div>
              <label>BIR Certificate</label>
              <input type="file" name="birCertificate" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
            </div>
          </div>
        </fieldset>

        {/* Contact Information */}
        <fieldset>
          <legend>Contact Information</legend>
          <div className="grid">
            <div>
              <label>First Name <span>*</span></label>
              <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
            </div>
            <div>
              <label>Middle Name</label>
              <input type="text" name="middleName" value={form.middleName} onChange={handleChange} />
            </div>
            <div>
              <label>Last Name <span>*</span></label>
              <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
            </div>
            <div>
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label>Mailing Address <span>*</span></label>
              <input type="text" name="mailAddress" value={form.mailAddress} onChange={handleChange} required />
            </div>
            <div>
              <label>Email <span>*</span></label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label>Mobile <span>*</span></label>
              <input type="tel" name="mobile" value={form.mobile} onChange={handleChange} required placeholder="+639XXXXXXXXX" pattern="^\+639\d{9}$" />
            </div>
          </div>
        </fieldset>

        <div className="submit-btn">
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPermit;