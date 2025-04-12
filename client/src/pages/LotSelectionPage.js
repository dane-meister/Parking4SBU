import { useEffect, useState } from "react";
import axios from 'axios';
import '../stylesheets/LotSelection.css'
import '../stylesheets/index.css'
import { Sidebar, Map } from '../components';
const HOST = "http://localhost:8000"

const LotSelectionPage = () => {
  // State to store buildings and parking lots
  const [ selectedLot, setSelectedLot ] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [parkingLots, setParkingLots] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track any errors

  // Fetch buildings and parking lots on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data

        // Fetch buildings and parking lots data concurrently
        const [buildingsRes, parkingLotsRes] = await Promise.all([
          axios.get(`${HOST}/api/buildings`, { withCredentials: true }),
          axios.get(`${HOST}/api/parking-lots`, { withCredentials: true }),
        ]);     

        // Update state with fetched data
        setBuildings(buildingsRes.data);
        setParkingLots(parkingLotsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err); // Log error to console
        setError("Failed to load data."); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetching is complete
      }
    };

    fetchData(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="main-container-lot-selection">
      {/* Left: Map container */}
      <div className="map-container">
        <Map selectedLot={selectedLot}/>
      </div>

      {/* Right: Results & selections container */}
      <div className="results-container">
        {loading ? (
          // Show loading message while data is being fetched
          <p>Loading...</p>
        ) : error ? (
          // Show error message if there was an issue fetching data
          <p>{error}</p>
        ) : (
          <>
            {/* Sidebar component to display buildings and parking lots */}
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
  );
};

export default LotSelectionPage;