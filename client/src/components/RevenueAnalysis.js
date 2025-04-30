import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000"; // backend API base URL

export default function RevenueAnalysis() {

  return (
    <div className="revenue-analysis">
      <h2>Revenue Analysis</h2>
      <h3>Not done...</h3>
    </div>
  );
}