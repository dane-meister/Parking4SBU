import React from 'react';

export default function CurrentReservationItem({ reservation }) {
  const {
    lotName,
    date,
    time,
    licensePlate,
    reservationId,
    status,
    spotCount,
    eventDescription
  } = reservation;

  const statusClass = `status ${status.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="reservation-item">
      <div className="reservation-header">
        <span className="lot-name">
          {lotName}
          {eventDescription && (
            <span className="event-badge">EVENT</span>
          )}
        </span>
        <span className={statusClass}>{status}</span>
      </div>

      <div className="reservation-details">
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Time:</strong> {time}</p>
        <p><strong>License Plate:</strong> {licensePlate}</p>
        <p><strong>Spots Reserved:</strong> {spotCount || 1}</p>
        {eventDescription && (
          <p><strong>Event:</strong> {eventDescription}</p>
        )}
        {reservationId && (
          <p><strong>Reservation ID:</strong> {reservationId}</p>
        )}
      </div>
    </div>
  );
}

