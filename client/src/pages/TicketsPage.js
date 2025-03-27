import { TicketItem } from '../components';
import '../stylesheets/index.css';
import '../stylesheets/Ticket.css';

export default function TicketPage() {
	// Hardcoded dummy ticket data
	const ticket = {
		summons: '5019225', // Ticket number
		plate: 'ABC1234 NY PA', // License plate and state
		vehicle: 'Chevrolet Colorado', // Vehicle make and model
		permit: '802250', // Parking permit number
		location: 'NORTH P / LOT #5A', // Parking location
		space: '1', // Parking space number
		violation: 'EXPIRED METER', // Violation type
		fine: 30.00, // Fine amount in dollars
		comments: 'You parked terribly too...', // Additional comments
		date: '11/08/2024', // Date of the ticket
		time: '4:46 PM', // Time of the ticket
		officer: '604' // Issuing officer's ID
	};

	return (
		<div className="ticket-container">
			{/* Unpaid Banner */}
			<div className="unpaid-banner">
				<span>Your Account Currently has <b>1 Unpaid</b> Tickets</span>
				<button className="view-all-btn">View All Tickets</button>
			</div>

			{/* Lookup Section */}
			<div className="lookup-section">
				<h2>Lookup Ticket</h2>
				<div className="lookup-fields">
					{/* Input fields for ticket lookup */}
					<input type="text" placeholder="Ticket #" defaultValue={ticket.summons} />
					<input type="text" placeholder="Plate Number or VIN" defaultValue="ABC1234" />
					<button className="search-btn">Search</button>
				</div>
			</div>

			{/* Ticket Details */}
			{/* Render ticket details using the TicketItem component */}
			<TicketItem ticket={ticket} />

			{/* Late Fee Warning */}
			<div className="late-fee-warning">
				A LATE FEE WILL BE ADDED IF FULL PAYMENT OR AN APPEAL IS NOT RECEIVED BEFORE 11/22/2024
			</div>

			{/* Action Buttons */}
			<div className="action-buttons">
				{/* Buttons for payment and appeal actions */}
				<button className="pay-btn">PAY</button>
				<button className="appeal-btn">APPEAL</button>
			</div>
		</div>
	);
}
