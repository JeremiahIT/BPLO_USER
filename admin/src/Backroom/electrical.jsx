<<<<<<< HEAD
import React from 'react';
import './electrical.css';

export default function Electrical() {
  return (
    <div className="electrical-container">
      <p>
        This is the Electrical page. Here you can track and manage electrical permits,
        inspections, and compliance records.
      </p>
    </div>
  );
}
=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../config/api';
import './electrical.css';
>>>>>>> c7e4b8da6c783ac05068fc06385d37c0dfc612b4
