import React from 'react';

// Component to display a single reservation item
export default function CurrentReservationItem({ reservation }) {
  // Destructure reservation details from the reservation prop
  const { lotName, date, time, permitNumber, status } = reservation;

  return (
    <div className="reservation-item">
      {/* Header section displaying the lot name and reservation status */}
      <div className="reservation-header">
        <span className="lot-name">{lotName}</span>
        {/* Apply a dynamic class based on the status */}
        <span className={`status ${status.toLowerCase()}`}>{status}</span>
      </div>

      {/* Details section displaying date, time, and permit number */}
      <div className="reservation-details">
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Time:</strong> {time}</p>
        <p><strong>Permit #:</strong> {permitNumber}</p>
      </div>
    </div>
  );
}

  