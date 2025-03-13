import { useEffect, useState } from "react";
import axios from 'axios';
import '../stylesheets/LotSelection.css'
import '../stylesheets/index.css'
import { Sidebar, Map } from '../components';

const LotSelection = ({ selectedLot, setSelectedLot }) => {
  // State to store buildings and parking lots
  const [buildings, setBuildings] = useState([]);
  const [parkingLots, setParkingLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    // Fetch buildings and parking lots on mount
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [buildingsRes, parkingLotsRes] = await Promise.all([
            axios.get("http://localhost:8000/api/buildings"),
            axios.get("http://localhost:8000/api/parking-lots"),
          ]);
  
          setBuildings(buildingsRes.data);
          setParkingLots(parkingLotsRes.data);
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Failed to load data.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);

  return (
    <div className="main-container">
        {/* Left: Map container */}
        <div className="map-container">
          <Map />
        </div>

        {/* Right: Results & selections container */}
        <div className="results-container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <Sidebar 
              selectedLot={selectedLot} 
              setSelectedLot={setSelectedLot} 
              buildings={buildings}
              parkingLots={parkingLots}
            />
          </>
        )}
        </div>
    </div>
  )
}

export default LotSelection;