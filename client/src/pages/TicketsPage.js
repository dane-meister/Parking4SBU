import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TicketItem } from '../components';
import axios from 'axios';
import '../stylesheets/index.css';
import '../stylesheets/Ticket.css';

const HOST = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function TicketPage() {
	const { user } = useAuth();
	const [tickets, setTickets] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user?.user_id) return;

		axios.get(`${HOST}/api/tickets/user/${user.user_id}`, { withCredentials: true })
			.then(res => setTickets(res.data ?? []))
			.catch(err => {
				console.error('Error fetching tickets:', err);
				setTickets([]);
			})
			.finally(() => setLoading(false));
	}, [user]);

	const handlePay = async (ticketId) => {
		try {
			await axios.patch(`${HOST}/api/tickets/${ticketId}/pay`, {}, { withCredentials: true });
			const res = await axios.get(`${HOST}/api/tickets/user/${user.user_id}`, { withCredentials: true });
			setTickets(res.data ?? []);
		} catch (err) {
			console.error("Payment error:", err);
			alert("Failed to pay ticket.");
		}
	};

	const handleAppeal = async (ticketId) => {
		const reason = prompt("Enter your appeal reason:");
		if (!reason) return;
		try {
			await axios.patch(`${HOST}/api/tickets/${ticketId}/appeal`, {
				appeal_reason: reason
			}, { withCredentials: true });

			const res = await axios.get(`${HOST}/api/tickets/user/${user.user_id}`, { withCredentials: true });
			setTickets(res.data ?? []);
		} catch (err) {
			console.error("Appeal error:", err);
			alert("Failed to submit appeal.");
		}
	};

	const unpaidCount = Array.isArray(tickets) ? tickets.filter(t => t.status === 'unpaid').length : 0;

	return (
		<main className="ticket-page">
			<h1>My Tickets</h1>

			{unpaidCount > 0 && (
				<div className="unpaid-banner">
					<span>Your account has <b><u>{unpaidCount} unpaid</u></b> ticket{unpaidCount > 1 ? 's' : ''}</span>
				</div>
			)}

			{loading ? (
				<p>Loading tickets...</p>
			) : tickets.length === 0 ? (
				<p>No tickets found.</p>
			) : (
				<>
					<h2>Ticket History</h2>
					{tickets.map(ticket => (
						<div key={ticket.id}>
							<TicketItem ticket={ticket} />
							<div className="action-buttons">
								{ticket.status === 'unpaid' && (
									<>
										<button className="appeal-btn" onClick={() => handleAppeal(ticket.id)}>APPEAL</button>
										<button className="pay-btn" onClick={() => handlePay(ticket.id)}>PAY</button>
									</>
								)}
								{ticket.status === 'appealed' && (
									<p className="ticket-status-msg">Appeal submitted on {new Date(ticket.appeal_submitted_at).toLocaleDateString()}</p>
								)}
								{ticket.status === 'paid' && (
									<p className="ticket-status-msg">Ticket paid</p>
								)}
							</div>
							<hr style={{ margin: '25px 0' }} />
						</div>
					))}
				</>
			)}
		</main>
	);
}
