<<<<<<< HEAD
import React from 'react';
import './cho.css';

export default function Cho() {
  return (
    <div className="cho-container">
      <p>
        This is the CHO (City Health Office) page. Here you can view and manage health-related
        permits, inspections, and compliance documentation.
      </p>
    </div>
  );
}
=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../config/api';
import './cho.css';
>>>>>>> c7e4b8da6c783ac05068fc06385d37c0dfc612b4
