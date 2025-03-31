import React, { useState } from "react";
import "../stylesheets/TimeSelector.css";

const TimeSelector = ({ mode, initialTimes, onSelect, onClose }) => {
    const [arrivalDate, setArrivalDate] = useState("");
    const [arrivalTime, setArrivalTime] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [departureTime, setDepartureTime] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const handleSave = () => {
        //fallback to initial times if not provided
        if (!arrivalDate || !arrivalTime || !departureDate || !departureTime) {
          alert("Please select both date and time for both arrival and departure.");
          return;
        }
        
        const newArrival = new Date(`${arrivalDate}T${arrivalTime}`);
        const newDeparture = new Date(`${departureDate}T${departureTime}`);
    
        const options = { weekday: "short", month: "short", day: "numeric" };
        const formattedArrivalDate = newArrival.toLocaleDateString("en-US", options);
        const formattedDepartureDate = newDeparture.toLocaleDateString("en-US", options);
    
        const formattedArrivalTime = newArrival.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        const formattedDepartureTime = newDeparture.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        
        const formattedArrival = `${formattedArrivalDate} | ${formattedArrivalTime}`;
        const formattedDeparture = `${formattedDepartureDate} | ${formattedDepartureTime}`;
    
        onSelect(formattedArrival, formattedDeparture);
      };


      return (
        <div className="time-selector-overlay">
          <div className="time-selector-card">
            <h3>Select {mode === "arrival" ? "Arrival" : "Departure"} Date and Time</h3>
            <div className="time-selector-inputs">
              <label>
                Arrival Date:
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
              <label>
                Arrival Time:
                <input
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => setTime(e.target.value)}
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