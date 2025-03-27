import React from 'react';

// TicketItem component displays the details of a parking ticket.
// It takes a `ticket` object as a prop and renders its properties.
export default function TicketItem({ ticket }) {
    return (
        <div className="ticket-details">
            {/* Left section displays general ticket information */}
            <div className="left">
                <p>Summons # {ticket.summons}</p> {/* Ticket summons number */}
                <p>Plate # {ticket.plate}</p> {/* Vehicle plate number */}
                <p>Vehicle: {ticket.vehicle}</p> {/* Vehicle description */}
                <p>Permit # {ticket.permit}</p> {/* Parking permit number */}
                <p>Location: {ticket.location}</p> {/* Location of the violation */}
                <p>Space # {ticket.space}</p> {/* Parking space number */}
            </div>
            {/* Right section displays violation details */}
            <div className="right">
                <p>Violation: {ticket.violation}</p> {/* Description of the violation */}
                <p>Fine: ${ticket.fine}</p> {/* Fine amount */}
                <p>Comments: {ticket.comments}</p> {/* Additional comments */}
                <p>Date: {ticket.date} {ticket.time}</p> {/* Date and time of the violation */}
                <p>Officer: {ticket.officer}</p> {/* Officer who issued the ticket */}
            </div>
        </div>
    );
}

