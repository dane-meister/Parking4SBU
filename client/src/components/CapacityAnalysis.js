import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000"; // backend API base URL

export default function CapacityAnalysis() {
  const [capacityData, setCapacityData] = useState([]);
  const [filter, setFilter] = useState('all'); // all, commuter, resident, faculty
  const [lotId, setLotId] = useState(null);

  useEffect(() => {
    fetchCapacityAnalysis();
  }, [filter, lotId]);

  const fetchCapacityAnalysis = async () => {
    try {
      const response = await axios.get(`${HOST}/api/admin/analytics/capacity`, { withCredentials: true });
      setCapacityData(response.data.results);
    } catch (err) {
      console.error(err);
    } 
  };

  return (
    <div className="capacity-analysis">
      <h2>Capacity Analysis</h2>
      <div className="filters">
        <h3>User Type: </h3>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          {/* <option value="all">All Users</option> */}
          <option value="faculty">Faculty</option>
          <option value="resident">Resident</option>
          <option value="commuter">Commuter</option>
        </select>
      </div>
      <table className="capacity-table">
        <thead>
          <tr>
            <th>Lot Name</th>
            <th>Total Capacity</th>
            <th>Current Occupancy</th>
            <th>Occupancy Rate</th>
          </tr>
        </thead>
        <tbody>
          {capacityData.map((lot) => (
            <tr key={lot.lotId}>
              <td>{lot.lotName}</td>
              <td>{lot.capacity}</td>
              <td>{lot.currentOccupancy}</td>
              <td>{lot.occupancyRate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}