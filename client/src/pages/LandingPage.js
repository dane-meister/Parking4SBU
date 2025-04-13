import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import Header from "../components/Header.js";
import Search from "../components/Search.js";
import "../stylesheets/LandingPage.css"; 
import TimeSelector from "../components/TimeSelector";
import { getInitialTimes } from "../components/Header"; 

function LandingPage() {
  //"hourly" or "daily"
  const [pricingType, setPricingType] = useState("hourly");
  const [buildingLotType, setBuildingLotType] = useState("building");
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [value, setValue] = useState("");

  const [selectedLot, setSelectedLot] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [parkingLots, setParkingLots] = useState([]); // Declare parkingLots before using it

  // Now it's safe to initialize these with the parkingLots variable
  const [lotResults, setLotResults] = useState(parkingLots);
  const [baseLots, setBaseLots] = useState(parkingLots);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const [times, setTimes] = useState(getInitialTimes());
  const [editingMode, setEditingMode] = useState(null);

  // Fetch buildings and parking lots on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data

        // Fetch buildings and parking lots data concurrently
        const [buildingsRes, parkingLotsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/buildings", { withCredentials: true }),
          axios.get("http://localhost:8000/api/parking-lots", { withCredentials: true }),
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

    fetchData(); 
  }, []); 



  const handleTimeSelect = (mode, formatted) => {
    setTimes((prev) => ({
      ...prev,
      [mode]: formatted,
    }));
    setEditingMode(null);
  };


  const handleFindParking = () => {
    const searchParams = {
      pricingType,
      buildingLotType,
      searchValue: value,
      selectedBuilding, 
      times, 
      // You can add more parameters if needed
    };

    // Navigate and pass searchParams in the state object
    navigate("/lotselection", { state: searchParams });
  };
  

  return (
    <div className="landing-page">
      <Header />

      <div className="landing-content">
        <h1 className="slogan">park.</h1>
        
        {/* Pricing options (Hourly / Daily) */}
        <div className="pricing-options">
          <button
            className={pricingType === "hourly" ? "option selected" : "option"}
            onClick={() => setPricingType("hourly")}
          >
            Hourly
          </button>
          <button
            className={pricingType === "daily" ? "option selected" : "option"}
            onClick={() => setPricingType("daily")}
          >
            Daily
          </button>
        </div>
        

        <div className="building-lot-toggle">
          <span
            className={`toggle-option ${buildingLotType === "building" ? "selected" : ""}`}
            onClick={() => setBuildingLotType("building")}
          >
            Building
          </span>
          <span>/</span>
          <span
            className={`toggle-option ${buildingLotType === "lot" ? "selected" : ""}`}
            onClick={() => setBuildingLotType("lot")}
          >
            Lot
          </span>
        </div>


        <div className="search-container">
          <Search 
            searchType={buildingLotType}
            buildings={buildings}
            parkingLots={parkingLots}
            value={value}
            setValue={setValue}
            setSelectedBuilding={setSelectedBuilding} 
            setLotResults={setLotResults}
            setBaseLots={setBaseLots}
            setSelectedLot={setSelectedLot}
          />
        </div>


        {/* Time selection bar */}
        <div className="time-selector-container">
          <div className="time-input">
            <span className="time-label">Arrive After:</span>
            <div className="time-row">
              <span className="time-value">{times.arrival}</span>
              <button className="edit-button" onClick={() => setEditingMode("arrival")}>
                <img src="/images/edit-icon1.png" alt="Edit Arrival" className="edit-icon"/>
              </button>
            </div>
          </div>
          <div className="arrow-container">
            <img src="/images/arrow1.png" alt="Arrow" className="arrow-icon"/>
          </div>
          <div className="time-input">
            <span className="time-label">Exit Before:</span>
            <div className="time-row">
              <span className="time-value">{times.departure}</span>
              <button className="edit-button" onClick={() => setEditingMode("departure")}>
                <img src="/images/edit-icon1.png" alt="Edit Departure" className="edit-icon"/>
              </button>
            </div>
          </div>
          {editingMode && (
            <TimeSelector
              mode={editingMode}
              initialTimes={times}
              onSelect={handleTimeSelect}
              onClose={() => setEditingMode(null)}
            />
          )}
        </div>

        <div className="find-parking-btn">
          <button onClick={handleFindParking}>
            <img src="/images/search-icon.webp" alt="Search Icon" style={{ width: "16px", height: "16px" }} />
            Find Parking
          </button>
        </div>

      </div>
    </div>
  );
}

export default LandingPage;