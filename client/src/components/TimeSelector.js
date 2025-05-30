import React, { useState } from "react";
import { validateAndFormatTimeSelection } from "../utils/validateAndFormatTimeSelection";
import "../stylesheets/TimeSelector.css";

const TimeSelector = ({ mode, initialTimes, onSelect, onClose }) => {
  // State to store the selected date and time
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedDate, setSelectedDate] = useState(() => {
    const raw = initialTimes?.[mode];
    if (!raw) return "";
    const [dateStr] = raw.split(" | ");
    const parsed = new Date(`${dateStr}, ${new Date().getFullYear()}`);
    if (isNaN(parsed)) return "";
    return parsed.toISOString().split("T")[0]; // yyyy-mm-dd
  });
  
  const [selectedHour, setSelectedHour] = useState(() => {
    const raw = initialTimes?.[mode];
    if (!raw) return "";
    const [, timeStr] = raw.split(" | ");
    if (!timeStr) return "";
    const parsedHour = new Date(`2000-01-01 ${timeStr}`);
    if (isNaN(parsedHour)) return "";
    return String(parsedHour.getHours());
  });
  

  // Function to handle the save button click
  const handleSave = () => {
    const result = validateAndFormatTimeSelection({
      selectedDate,
      selectedHour,
      mode,
      initialTimes
    });
  
    if (result.error) {
      setErrorMessage(result.error);
      return;
    }

    setErrorMessage(""); 
  
    // Update only the opposite field if autoAdjust exists
    if (result.autoAdjust) {
      onSelect(result.autoAdjust.mode, result.autoAdjust.value);
    }
  
    // Update current field
    if (!result.autoAdjust || result.autoAdjust.mode !== mode) {
      onSelect(mode, result.formatted);
    }
  };
  
  const formatHour = (i) => {
    if (i === 0) return "12:00 AM";
    if (i < 12) return `${i}:00 AM`;
    if (i === 12) return "12:00 PM";
    return `${i - 12}:00 PM`;
  };


  return (
    <div className="time-selector-overlay">
      <div className="time-selector-card">
        {/* Display the mode-specific title */}
        <h3>Select {mode === "arrival" ? "Arrival" : "Departure"} Date & Time</h3>
        <div className="time-selector-inputs">
          {/* Input for selecting the date */}
          <label>
            Date:
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </label>
          {/* Input for selecting the time */}
          <label>
            Hour:
            <div className="custom-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {selectedHour === ""
                ? "-- Select Hour --"
                : `${formatHour(parseInt(selectedHour))}`}
              <div className="custom-arrow">▼</div>
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
          <button onClick={handleSave}>Save</button>
          {/* Button to cancel and close the selector */}
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default TimeSelector;