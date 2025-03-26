import React from 'react';

export default function CurrentReservationItem({ reservation }) {
  const { lotName, date, time, permitNumber, status } = reservation;

  return (
    <div className="reservation-item">
      <div className="reservation-header">
        <span className="lot-name">{lotName}</span>
        <span className={`status ${status.toLowerCase()}`}>{status}</span>
      </div>

      <div className="reservation-details">
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Time:</strong> {time}</p>
        <p><strong>Permit #:</strong> {permitNumber}</p>
      </div>
    </div>
  );
}

  