import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CapacityPieChart from './CapacityPieChart';

const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000"; // backend API base URL

export default function CapacityAnalysis() {
  const [capacityData, setCapacityData] = useState([]);
  const [userCategoryData, setUserCategoryData] = useState([]);
  const [selectedLotId, setSelectedLotId] = useState(null);

  useEffect(() => {
    fetchCapacityAnalysis();
  }, []);

  useEffect(() => {
  console.log("User Category Data:", userCategoryData);
}, [userCategoryData]);

useEffect(() => {
  console.log("Selected Lot ID:", selectedLotId);
  console.log("Filtered Data:", filteredUserCategoryData);
}, [selectedLotId]);

  const fetchCapacityAnalysis = async () => {
    try {
      const response = await axios.get(`${HOST}/api/admin/analytics/capacity-analysis`, { withCredentials: true });
      setCapacityData(response.data.results);
      setUserCategoryData(response.data.userCategorySummary);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUserCategoryData = selectedLotId
    ? userCategoryData.filter((entry) => entry.lotId === selectedLotId)
    : [];

  return (
    <div className="capacity-analysis">
      <h2>Capacity Analysis</h2>
      <div className="capacity-analysis-section">
        <div className="capacity-table">
          <h3>All Lots</h3>
          <div className="table-wrapper">
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
                  <tr
                    key={lot.lotId}
                    onClick={() => setSelectedLotId(lot.lotId)}
                    style={{ cursor: 'pointer', backgroundColor: selectedLotId === lot.lotId ? '#f0f0f0' : 'white' }}
                  >
                    <td>{lot.lotName}</td>
                    <td>{lot.capacity}</td>
                    <td>{lot.currentOccupancy}</td>
                    <td>{lot.occupancyRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="user-type-chart">
          <h3>Occupancy by User Types</h3>
          <CapacityPieChart data={filteredUserCategoryData} />
        </div>
      </div>
    </div>

  );
}