import { TicketItem } from '../components';
import '../stylesheets/index.css';
import '../stylesheets/Ticket.css';

export default function TicketPage() {
  // Hardcoded dummy ticket data
  const ticket = {
    summons: '5019225',
    plate: 'ABC1234 NY PA',
    vehicle: 'Chevrolet Colorado',
    permit: '802250',
    location: 'NORTH P / LOT #5A',
    space: '1',
    violation: 'EXPIRED METER',
    fine: 30.00,
    comments: 'You parked terribly too...',
    date: '11/08/2024',
    time: '4:46 PM',
    officer: '604'
  };

  return (
    <div className="ticket-container">
      {/* Unpaid Banner */}
      <div className="unpaid-banner">
        <span>Your Account Currently has <b>1 Unpaid</b> Tickets</span>
        <button className="view-all-btn">View All Tickets</button>
      </div>

      {/* Lookup */}
      <div className="lookup-section">
        <h2>Lookup Ticket</h2>
        <div className="lookup-fields">
          <input type="text" placeholder="Ticket #" defaultValue={ticket.summons} />
          <input type="text" placeholder="Plate Number or VIN" defaultValue="ABC1234" />
          <button className="search-btn">Search</button>
        </div>
      </div>

      {/* Ticket Details */}
      <TicketItem ticket={ticket} />

      {/* Late Fee Warning */}
      <div className="late-fee-warning">
        A LATE FEE WILL BE ADDED IF FULL PAYMENT OR AN APPEAL IS NOT RECEIVED BEFORE 11/22/2024
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="pay-btn">PAY</button>
        <button className="appeal-btn">APPEAL</button>
      </div>
    </div>
  );
}
