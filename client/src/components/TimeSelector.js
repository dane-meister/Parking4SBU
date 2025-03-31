import React, { useState } from "react";
import "../stylesheets/TimeSelector.css";

const TimeSelector = ({ mode, initialTimes, onSelect, onClose }) => {
    // const [arrivalDate, setArrivalDate] = useState("");
    // const [arrivalTime, setArrivalTime] = useState("");
    // const [departureDate, setDepartureDate] = useState("");
    // const [departureTime, setDepartureTime] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const handleSave = () => {
        //fallback to initial times if not provided
        if (!selectedDate || !selectedTime) {
          alert("Please select both date and time for both arrival and departure.");
          return;
        }
        
        const newDate = new Date(`${selectedDate}T${selectedTime}`);
        const options = { weekday: "short", month: "short", day: "numeric" };
        const formattedDate = newDate.toLocaleDateString("en-US", options);
        const formattedTime = newDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        });
        const formatted = `${formattedDate} | ${formattedTime}`;
    
        onSelect(mode, formatted);
      };


      return (
        <div className="time-selector-overlay">
        <div className="time-selector-card">
          <h3>Select {mode === "arrival" ? "Arrival" : "Departure"} Date & Time</h3>
          <div className="time-selector-inputs">
            <label>
              Date:
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </label>
            <label>
              Time:
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </label>
          </div>
          <div className="time-selector-buttons">
            <button onClick={handleSave}>Save</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
      );
};

export default TimeSelector;