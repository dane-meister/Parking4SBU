import React, { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import TimeSelector from "./TimeSelector";
import '../stylesheets/Header.css';

// Dynamically calculates initial arrival and departure times
const getInitialTimes = () => {
  const now = new Date();
  // Round up to the next hour for arrival time
  const arrivalDate = new Date(now);
  arrivalDate.setMinutes(0, 0, 0);
  if (now.getMinutes() > 0 || now.getSeconds() > 0) {
    arrivalDate.setHours(arrivalDate.getHours() + 1);
  }
  // Set departure time to one hour after arrival
  const departureDate = new Date(arrivalDate);
  departureDate.setHours(departureDate.getHours() + 1);

  // Format the dates and times for display
  const dateOptions = { weekday: "short", month: "short", day: "numeric" };
  const arrivalDateStr = arrivalDate.toLocaleDateString("en-US", dateOptions);
  const departureDateStr = departureDate.toLocaleDateString("en-US", dateOptions);
  const arrivalTimeStr = arrivalDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const departureTimeStr = departureDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  
  return {
    arrival: `${arrivalDateStr} | ${arrivalTimeStr}`,
    departure: `${departureDateStr} | ${departureTimeStr}`,
  };
};

const Header = ({ selectedLot, setSelectedLot }) => {
  // State to manage arrival and departure times
  const [times, setTimes] = useState(getInitialTimes());
  // State to track which time (arrival or departure) is being edited
  const [editingMode, setEditingMode] = useState(null); 
  // React Router hook to get the current location
  const location = useLocation(); 

  // Handles time selection from the TimeSelector component
  const handleTimeSelect = (mode, formatted) => {
    setTimes((prev) => ({
      ...prev,
      [mode]: formatted,
    }));
    setEditingMode(null); // Exit editing mode after selection
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          {/* Logo and title link to the home page */}
          <Link to="/home" onClick={() => setSelectedLot(null)}>
            <img className="logo" src="/images/sbu-logo.png" alt="Stony Brook Logo" />
          </Link>
          <div className="header-title">P4SBU</div>
        </div>
        <div className="header-right">
          {/* Navigation links */}
          <Link to="/tickets" className="header-link">Tickets</Link>
          <Link to="/reservations" className="header-link">Reservations</Link>
          <Link to="/profile" className="header-link">
            <img className="profile-icon" src="/images/profile.png" alt="Profile Icon" />
          </Link>
        </div>
      </header>

      <nav className="nav-banner">
        {/* Show time selection only on the home page */}
        {location.pathname === "/home" && (
          <div className="time-selector-container">
            <div className="time-input">
              <span className="time-label">Arrive After:</span>
              <div className="time-row">
                {/* Display arrival time and edit button */}
                <span className="time-value">{times.arrival}</span>
                <button className="edit-button" onClick={() => setEditingMode("arrival")}>
                  <img src="/images/edit-icon.png" alt="Edit Arrival" className="edit-icon" />
                </button>
              </div>
            </div>

            <div className="arrow-container">
              {/* Arrow icon between arrival and departure times */}
              <img src="/images/arrow-icon.png" alt="Arrow" className="arrow-icon" />
            </div>
            
            <div className="time-input">
              <span className="time-label">Exit Before:</span>
              <div className="time-row">
                {/* Display departure time and edit button */}
                <span className="time-value">{times.departure}</span>
                <button className="edit-button" onClick={() => setEditingMode("departure")}>
                  <img src="/images/edit-icon.png" alt="Edit Departure" className="edit-icon" />
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Render TimeSelector component when editing mode is active */}
        {editingMode && (
          <TimeSelector
            mode={editingMode}
            initialTimes={times}
            onSelect={handleTimeSelect}
            onClose={() => setEditingMode(null)}
          />
        )}
      </nav>
    </>
  );
};

export default Header;
