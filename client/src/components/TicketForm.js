import { useState } from 'react';
import axios from 'axios';
import '../stylesheets/Admin.css';

const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function TicketForm({ user, onSuccess, onCancel }) {
	const [formData, setFormData] = useState({
		summons_number: Math.floor(Math.random() * 10000000).toString(),
		plate: '',
		permit: '',
		location: '',
		space: '',
		violation: '',
		comments: '',
		fine: '',
		officer_id: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const payload = {
				...formData,
				user_id: user.user_id,
				issued_at: new Date(),
				officer_id: formData.officer_id ? Number(formData.officer_id) : null,
				fine: parseFloat(formData.fine)
			};

			console.log("Issuing ticket with payload:", payload);

			await axios.post(`${HOST}/api/tickets`, payload, { withCredentials: true });

			alert("Ticket successfully issued.");
			onSuccess?.(); // callback to parent
		} catch (err) {
			console.error("Failed to issue ticket:", err);
			alert("Failed to issue ticket.");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="ticket-form">
			<h2>Issue Ticket for {user.first_name} {user.last_name}</h2>

			<label htmlFor="plate">Plate</label>
			<input id="plate" name="plate" value={formData.plate} onChange={handleChange} />

			<label htmlFor="permit">Permit #</label>
			<input id="permit" name="permit" value={formData.permit} onChange={handleChange} />

			<label htmlFor="location">Location</label>
			<input id="location" name="location" value={formData.location} onChange={handleChange} />

			<label htmlFor="space">Space</label>
			<input id="space" name="space" value={formData.space} onChange={handleChange} />

			<label htmlFor="violation">Violation *</label>
			<input id="violation" name="violation" value={formData.violation} onChange={handleChange} required />

			<label htmlFor="comments">Comments</label>
			<textarea id="comments" name="comments" value={formData.comments} onChange={handleChange} />

			<label htmlFor="fine">Fine ($) *</label>
			<input
				id="fine"
				type="number"
				step="0.01"
				name="fine"
				value={formData.fine}
				onChange={handleChange}
				required
			/>

			<label htmlFor="officer_id">Officer ID</label>
			<input
				id="officer_id"
				type="number"
				name="officer_id"
				value={formData.officer_id}
				onChange={handleChange}
			/>

			<div className="form-buttons">
				<button type="submit" className="save-button">Submit Ticket</button>
				<button type="button" onClick={onCancel}>Cancel</button>
			</div>
		</form>
	);
}
