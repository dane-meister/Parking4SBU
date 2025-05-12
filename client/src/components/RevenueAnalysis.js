import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000";
const USER_TYPES = ['faculty', 'commuter', 'resident', 'visitor'];
const COLORS = ['#6B000D', '#002244', '#4B4B4B', '#D52027'];

export default function RevenueAnalysis() {
  const [revenueData, setRevenueData] = useState([]);
  const [selectedLotId, setSelectedLotId] = useState(null);

  useEffect(() => {
    fetchRevenueAnalysis();
  }, []);

  const fetchRevenueAnalysis = async () => {
    try {
      const response = await axios.get(`${HOST}/api/admin/analytics/revenue-analysis`, {
        withCredentials: true,
      });
      setRevenueData(response.data.results || []);
    } catch (err) {
      console.error("Failed to fetch revenue analysis:", err);
    }
  };

  // Get all lotId + lotName pairs
  const lots = [...new Map(revenueData.map(item => [item.lotId, item.lot])).entries()]
    .map(([lotId, lotName]) => ({ lotId, lotName }));

  // Create a single data object per selected lot, grouped by user type
  const selectedLotData = USER_TYPES.reduce((acc, type) => {
    const found = revenueData.find(entry => entry.lotId === selectedLotId && entry.userType === type);
    acc[type] = found ? found.revenue : 0;
    return acc;
  }, {});

  const selectedLotName = lots.find(lot => lot.lotId === selectedLotId)?.lotName || null;

  const chartData = selectedLotId
    ? [{
      lot: selectedLotName,
      ...selectedLotData
    }]
    : [];

  return (
    <div className="revenue-analysis">
      <h2>Revenue Analysis</h2>
      <div className="revenue-analysis-section" style={{ display: 'flex', gap: '2rem' }}>
        <div className="revenue-table">
          <div className="table-wrapper">
            <table className="revenue-table">
              <thead>
                <tr>
                  <th>Lot Name</th>
                  <th>Faculty</th>
                  <th>Commuter</th>
                  <th>Resident</th>
                  <th>Visitor</th>
                </tr>
              </thead>
              <tbody>
                {lots
                  .sort((a, b) => a.lotId - b.lotId)
                  .map((lot) => {
                    const revenuePerType = USER_TYPES.reduce((acc, type) => {
                      const match = revenueData.find(entry => entry.lotId === lot.lotId && entry.userType === type);
                      acc[type] = match ? match.revenue : 0;
                      return acc;
                    }, {});
                    return (
                      <tr
                        key={lot.lotId}
                        onClick={() => setSelectedLotId(lot.lotId)}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: selectedLotId === lot.lotId ? '#f0f0f0' : 'white'
                        }}
                      >
                        <td>{lot.lotName}</td>
                        <td>${revenuePerType.faculty.toFixed(2)}</td>
                        <td>${revenuePerType.commuter.toFixed(2)}</td>
                        <td>${revenuePerType.resident.toFixed(2)}</td>
                        <td>${revenuePerType.visitor.toFixed(2)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
        {selectedLotId && (
          <div className="user-type-chart">
            <h3>Revenue by User Types for "{selectedLotName}"</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="lot" />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                  {USER_TYPES.map((type, index) => (
                    <Bar
                      key={type}
                      dataKey={type}
                      fill={COLORS[index % COLORS.length]}
                      name={type.charAt(0).toUpperCase() + type.slice(1)}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
