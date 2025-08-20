import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./new_permit.css";
import { buildApiUrl } from "../config/api";

export default function NewPermitAdmin() {
  const navigate = useNavigate();
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPermits = async () => {
      try {
        setLoading(true);
        const response = await fetch(buildApiUrl("/permits"));
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        const data = await response.json();
        setPermits(data.permits || []);
      } catch (err) {
        console.error("Fetch permits error:", err);
        setError("Failed to load permits.");
      } finally {
        setLoading(false);
      }
    };
    fetchPermits();
  }, []);

  const fileUrl = (path) => {
    if (!path) return null;
    // Ensure your backend serves /uploads as static (app.use("/uploads", express.static("uploads")))
    return buildApiUrl("/" + path.replace(/\\/g, "/"));
  };

  return (
    <div className="permit-container">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        &larr; Back
      </button>

      <h1 className="form-title">Submitted Business Permits</h1>

      {loading && <p>Loading permits...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && permits.length === 0 && <p>No permits submitted yet.</p>}

      <div className="permit-list">
        {permits.map((permit) => (
          <div key={permit.id} className="permit-card">
            <h2>{permit.business_name}</h2>
            <p><strong>Permit No:</strong> {permit.permit_number}</p>
            <p><strong>Business Type:</strong> {permit.business_type}</p>
            <p><strong>Nature of Business:</strong> {permit.trade_name}</p>
            <p><strong>TIN:</strong> {permit.tax_identification_number}</p>
            <p><strong>Owner:</strong> {permit.owner_first_name} {permit.owner_middle_name || ""} {permit.owner_last_name}</p>
            <p><strong>Gender:</strong> {permit.owner_sex}</p>
            <p><strong>Mail Address:</strong> {permit.mail_address}</p>
            <p><strong>Email:</strong> {permit.email}</p>
            <p><strong>Mobile:</strong> {permit.mobile}</p>

            {/* File links */}
            <div className="files">
              {permit.dti_certificate && (
                <a href={fileUrl(permit.dti_certificate)} target="_blank" rel="noopener noreferrer">
                  View DTI Certificate
                </a>
              )}
              {permit.sec_certificate && (
                <a href={fileUrl(permit.sec_certificate)} target="_blank" rel="noopener noreferrer">
                  View SEC Certificate
                </a>
              )}
              {permit.cda_certificate && (
                <a href={fileUrl(permit.cda_certificate)} target="_blank" rel="noopener noreferrer">
                  View CDA Certificate
                </a>
              )}
              {permit.bir_certificate && (
                <a href={fileUrl(permit.bir_certificate)} target="_blank" rel="noopener noreferrer">
                  View BIR Certificate
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
