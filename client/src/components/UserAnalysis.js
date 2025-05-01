import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000"; // backend API base URL

export default function UserAnalysis() {
  const [userData, setUserData] = useState([]);

  return (
    <div className="user-analysis">
      <h2>User Analysis</h2>
      <h3>Not done...</h3>
    </div>
  );
}