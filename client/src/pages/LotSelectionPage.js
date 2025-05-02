import { useEffect, useState } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import axios from 'axios';
import Header from "../components/Header"; 
import '../stylesheets/LotSelection.css'
import '../stylesheets/index.css'
import { fetchLotAvailability } from '../utils/fetchLotAvailability';
import { getDateWithTime } from '../utils/getDateWithTime';
import { Sidebar, Map } from '../components';
import { getInitialTimes } from "../components/Header";
// const HOST = "http://localhost:8000"
const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000"; // Use environment variable for API URL

const LotSelectionPage = () => {
  // State to store buildings and parking lots
  const [selectedLot, setSelectedLot] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [parkingLots, setParkingLots] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track any errors
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [lotAvailability, setLotAvailability] = useState({}); // State to store lot availability


  const location = useLocation();
  const searchParams = location.state; 
  const initialSearchValue = searchParams.searchValue || "";
  const initialSearchType = searchParams.buildingLotType || "building"; 
  const initialTimes = searchParams.times || getInitialTimes();

  const { times, setTimes } = useOutletContext(); // Get times from the parent component

  // Fetch buildings and parking lots on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
  
        const [buildingsRes, lotsRes] = await Promise.all([
          axios.get(`${HOST}/api/buildings`, { withCredentials: true }),
          axios.get(`${HOST}/api/parking-lots`, { withCredentials: true })
        ]);
  
        const lots = lotsRes.data;
        setBuildings(buildingsRes.data);
  
        const startTime = getDateWithTime(times.arrival);
        const endTime = getDateWithTime(times.departure);
  
        const availabilityRes = await fetchLotAvailability(startTime, endTime);
  
        const availabilityMap = {};
        for (const entry of availabilityRes) {
          availabilityMap[entry.lotId] = entry.hourlyAvailability;
        }
  
        const lotsWithAvailability = lots.map(lot => ({
          ...lot,
          availability: availabilityMap[lot.id] || {}
        }));
  
        setParkingLots(lotsWithAvailability);
  
      } catch (err) {
        console.error("Error loading data", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [times]);
  
  
  return (
    <>
    <div className="main-container-lot-selection">
      {/* Left: Map container */}
      <div className="map-container">
        <Map selectedLot={selectedLot} selectedBuilding={selectedBuilding}/>
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
              selectedBuilding={selectedBuilding}
              setSelectedBuilding={setSelectedBuilding}
              initialSearchValue={initialSearchValue}
              initialSearchType={initialSearchType}
              times={times}
              setTimes={setTimes}
              initialRateType={searchParams?.pricingType || "hourly"} 
            />
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default LotSelectionPage;