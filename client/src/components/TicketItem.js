import React from 'react';

// TicketItem component displays the details of a parking ticket.
// It takes a `ticket` object as a prop and renders its properties.
export default function TicketItem({ ticket }) {
    return (
        <div className="ticket-details">
            {/* Left section displays general ticket information */}
            <div className="left">
                {ticket.summons_number && <p>Summons # {ticket.summons_number}</p>}
                {ticket.plate && <p>Plate # {ticket.plate}</p>}
                {ticket.permit && <p>Permit # {ticket.permit}</p>}
                {ticket.location && <p>Location: {ticket.location}</p>}
                {ticket.space && <p>Space # {ticket.space}</p>}
            </div>
            {/* Right section displays violation details */}
            <div className="right">
                {ticket.violation && <p>Violation: {ticket.violation}</p>}
                {ticket.fine && <p>Fine: ${ticket.fine}</p>}
                {ticket.comments && <p>Comments: {ticket.comments}</p>}
                {ticket.createdAt && <p>Date: {new Date(ticket.createdAt).toLocaleString()}</p>}
                {ticket.officer_id && <p>Officer: {ticket.officer_id}</p>}
            </div>
        </div>
    );
}
