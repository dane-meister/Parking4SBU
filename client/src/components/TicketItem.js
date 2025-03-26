import React from 'react';

export default function TicketItem({ ticket }) {
  return (
    <div className="ticket-details">
      <div className="left">
        <p>Summons # {ticket.summons}</p>
        <p>Plate # {ticket.plate}</p>
        <p>Vehicle: {ticket.vehicle}</p>
        <p>Permit # {ticket.permit}</p>
        <p>Location: {ticket.location}</p>
        <p>Space # {ticket.space}</p>
      </div>
      <div className="right">
        <p>Violation: {ticket.violation}</p>
        <p>Fine: ${ticket.fine}</p>
        <p>Comments: {ticket.comments}</p>
        <p>Date: {ticket.date} {ticket.time}</p>
        <p>Officer: {ticket.officer}</p>
      </div>
    </div>
  );
}

