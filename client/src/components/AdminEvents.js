import React from 'react';

export default function AdminEvents({
  eventReservations,
  handleApproveEvent,
  handleRejectEvent
}) {
  return (
    <>
      <h2>Pending Event Parking Requests</h2>
      <div className="user-list">
        {eventReservations.filter(reservation => reservation.status === 'pending').length === 0 ? (
          <p>No pending event reservations found.</p>
        ) : (
          eventReservations.filter(reservation => reservation.status === 'pending')
            .map(reservation => (
              <div key={reservation.id} className="user-card">
                <div className="user-info">
                  <strong style={{fontFamily: 'Barlow Bold, sans-serif'}}>Reservation #{reservation.id}</strong><br />
                  User ID: {reservation.user_id}<br />
                  Lot ID: {reservation.parking_lot_id}<br />
                  Spots: {reservation.spot_count}<br />
                  Time: {new Date(reservation.start_time).toLocaleString()} - {new Date(reservation.end_time).toLocaleString()}<br />
                  Description: {reservation.event_description || "N/A"}
                </div>
                <div className="user-actions">
                  <img
                    src="/images/check.png"
                    alt="Approve"
                    className="icon"
                    onClick={() => handleApproveEvent(reservation.id)}
                  />
                  <img
                    src="/images/x.png"
                    alt="Reject"
                    className="icon"
                    onClick={() => handleRejectEvent(reservation.id)}
                  />
                </div>
              </div>
            ))
        )}
      </div>

      <h2>All Event Parking</h2>
      <div className="user-list">
        {eventReservations.length === 0 ? (
          <p>No event reservations found.</p>
        ) : (
          eventReservations.map(reservation => (
            <div key={reservation.id} className="user-card">
              <div className="user-info">
                <strong>Reservation #{reservation.id}</strong><br />
                User ID: {reservation.user_id}<br />
                Lot ID: {reservation.parking_lot_id}<br />
                Spots: {reservation.spot_count}<br />
                Time: {new Date(reservation.start_time).toLocaleString()} - {new Date(reservation.end_time).toLocaleString()}<br />
                Description: {reservation.event_description || "N/A"}<br />
                Status: {reservation.status}<br />
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
