import React from "react";
import { useNavigate } from "react-router-dom";
import "./new_permit.css";

function NewPermit() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <button className="backButton" onClick={() => navigate("/")}>
        Back
      </button>
    </div>
  );
}

export default NewPermit;
