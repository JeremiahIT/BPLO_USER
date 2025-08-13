import React from 'react';
import './solidwaste.css';

export default function SolidWaste() {
  return (
    <div className="solidwaste-container">
      <p>
        This is the Solid Waste page. Here you can manage and view information
        related to waste collection, disposal, and environmental guidelines.
      </p>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../config/api';
import './solidwaste.css';
