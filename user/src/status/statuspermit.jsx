import React, { useState } from 'react';
import './statuspermit.css';

export default function StatusPermit() {
  const [message] = useState('Business Permit Status');

  return (
    <div className="status-permit">
      <h1>{message}</h1>
      <p>This is a placeholder page for checking your permit status.</p>
    </div>
  );
}
