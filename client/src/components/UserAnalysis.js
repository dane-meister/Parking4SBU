import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000"; // backend API base URL
const COLORS = ['#6B000D', '#002244', '#4B4B4B', '#D52027']; // dark red, navy, gray, bright red

const COLUMN_KEYS = [
  { label: 'Total Users', key: 'totalUsers' },
  { label: 'Total Reservations', key: 'totalReservations' },
  { label: 'Total Revenue', key: 'totalRevenue' },
  { label: 'Total Tickets', key: 'totalTickets' },
];

export default function UserAnalysis() {
  const [userData, setUserData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('totalRevenue');

  useEffect(() => {
    fetchUserAnalysis();
  }, []);

  const fetchUserAnalysis = async () => {
    try {
      const response = await axios.get(`${HOST}/api/admin/analytics/user-analysis`, {
        withCredentials: true
      });
      setUserData(response.data.results || []);
    } catch (err) {
      console.error("Failed to fetch user analysis:", err);
    }
  };

  return (
    <div className="user-analysis">
      <h2>User Analysis</h2>
      <div className="user-analysis-section">
        <div className="user-table">
          <div className="table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>User Type</th>
                  {COLUMN_KEYS.map(col => (
                    <th
                      key={col.key}
                      onClick={() => setSelectedMetric(col.key)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: selectedMetric === col.key ? '#e0e0e0' : 'transparent'
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {userData.map((user) => (
                  <tr key={user.userType}>
                    <td>{user.userType}</td>
                    <td>{user.totalUsers ?? 0}</td>
                    <td>{user.totalReservations ?? 0}</td>
                    <td>${user.totalRevenue?.toFixed(2) ?? '0.00'}</td>
                    <td>{user.totalTickets ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 style={{ marginTop: '2rem' }}>
            {COLUMN_KEYS.find(col => col.key === selectedMetric)?.label} by User Type
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={userData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="userType" />
                <YAxis allowDecimals={false} />
                <Tooltip
                  formatter={(value) =>
                    typeof value === 'number'
                      ? selectedMetric === 'totalRevenue'
                        ? `$${value.toFixed(2)}`
                        : value
                      : value
                  }
                />
                <Legend />
                <Bar
                  dataKey={selectedMetric}
                  name={COLUMN_KEYS.find(col => col.key === selectedMetric)?.label}
                  fill={COLORS[COLUMN_KEYS.findIndex(col => col.key === selectedMetric)] || '#8884d8'}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}