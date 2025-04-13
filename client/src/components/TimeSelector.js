import React, { useState } from "react";
import "../stylesheets/TimeSelector.css";

const TimeSelector = ({ mode, initialTimes, onSelect, onClose }) => {
  // State to store the selected date and time
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");

  // Function to handle the save button click
  const handleSave = () => {
    // Ensure both date and time are selected before proceeding
    if (!selectedDate || !selectedHour) {
      alert("Please select both date and time for both arrival and departure.");
      return;
    }

    const formattedHour = selectedHour.padStart(2, '0'); // "09" instead of "9"
    const timeStr = `${formattedHour}:00`;

    // Create a new Date object using the selected date and time
    const newDate = new Date(`${selectedDate}T${timeStr}`);
    const now = new Date();
    if (newDate < now) {
      alert("Please select a future time.");
      return;
    }

    
    // Format the date and time for display
    const options = { weekday: "short", month: "short", day: "numeric" };
    const formattedDate = newDate.toLocaleDateString("en-US", options);
    const formattedTime = newDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    const formatted = `${formattedDate} | ${formattedTime}`;
    
    // Pass the formatted date and time back to the parent component
    onSelect(mode, formatted);
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

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