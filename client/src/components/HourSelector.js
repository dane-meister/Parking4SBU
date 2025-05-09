import React, { useState } from "react";
import "../stylesheets/TimeSelector.css";

const TimeSelector = ({ mode, initialTimes, onSelect, onClose }) => {
  // State to store the selected date and time
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedHour, setSelectedHour] = useState(() => {
    const timeStr = initialTimes?.[mode];
    if (!timeStr) return "";
    const parsedHour = new Date(`2000-01-01 ${timeStr}`);
    if (isNaN(parsedHour)) return "";
    return String(parsedHour.getHours());
  });
  
  const formatHour = (i) => {
    if (i === 0) return "12:00 AM";
    if (i < 12) return `${i}:00 AM`;
    if (i === 12) return "12:00 PM";
    return `${i - 12}:00 PM`;
  };

  return (
    <div className="time-selector-overlay">
      <div className="hour-selector-card time-selector-card">
        {/* Display the mode-specific title */}
        <h3>Select {mode === "lot_start_time" ? "Lot Start" : "Lot End"} Time</h3>
        <div className="time-selector-inputs">
          {/* Input for selecting the time */}
          <label>
            Hour:
            <div className="custom-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {selectedHour === ""
                ? "-- Select Hour --"
                : `${formatHour(parseInt(selectedHour))}`}
              <div className="custom-arrow">
                <img src="/images/chevron.webp" alt="chevron"
                  style={{height: '18px'}}
                />
              </div>
              {dropdownOpen && (
                <ul className="dropdown-options">
                  {[...Array(24)].map((_, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        setSelectedHour(String(i));
                        setDropdownOpen(false);
                      }}
                    >
                      {formatHour(i)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </label>
          {/* Display error message if any */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
        <div className="time-selector-buttons">
          {/* Button to save the selected date and time */}
          <button type='button' onClick={() => onSelect(mode, `${selectedHour<10 ? '0': ''}${selectedHour}:00:00`)}>Save</button>
          {/* Button to cancel and close the selector */}
          <button type='button' onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default TimeSelector;