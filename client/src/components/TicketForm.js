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
	const [submitted, setSubmitted] = useState(false);
	const [errors, setErrors] = useState({});

	const validate = () => {
		const newErrors = {};
		if (!formData.violation || formData.violation.trim() === '') {
			newErrors.violation = "Violation is required.";
		}
		if (formData.fine === '') {
			newErrors.fine = "Fine amount is required.";
		} else if (isNaN(formData.fine) || Number(formData.fine) < 0) {
			newErrors.fine = "Fine must be a non-negative number.";
		}
		return newErrors;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		setErrors(prev => ({ ...prev, [name]: undefined })); // Clear error on change
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		try {
			setSubmitted(true);
			const payload = {
				...formData,
				user_id: user.user_id,
				issued_at: new Date(),
				officer_id: formData.officer_id ? Number(formData.officer_id) : null,
				fine: parseFloat(formData.fine)
			};

			await axios.post(`${HOST}/api/tickets`, payload, { withCredentials: true });

			alert("Ticket successfully issued.");
			onSuccess?.();
		} catch (err) {
			setSubmitted(false);
			console.error("Failed to issue ticket:", err);
			alert("Failed to issue ticket.");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="ticket-form" style={{height: '100%'}}>
			<h2>Issue Ticket for {user.first_name} {user.last_name}</h2>
			<section style={{overflowY: 'auto', height: '100%'}}>
				<div>
					<label htmlFor="plate">Plate</label>
					<input id="plate" name="plate" placeholder='ABC1234' value={formData.plate} onChange={handleChange} />
				</div>
				<div>
					<label htmlFor="permit">Permit #</label>
					<input id="permit" name="permit" value={formData.permit} onChange={handleChange} />
				</div>
				<div>
					<label htmlFor="location">Location</label>
					<input id="location" name="location" value={formData.location} onChange={handleChange} />
				</div>
				<div>
					<label htmlFor="space">Space</label>
					<input id="space" name="space" value={formData.space} onChange={handleChange} />
				</div>
				<div>
					<label htmlFor="violation">Violation *</label>
					<input
						id="violation"
						name="violation"
						value={formData.violation}
						onChange={handleChange}
						aria-invalid={!!errors.violation}
						aria-describedby={errors.violation ? "violation-error" : undefined}
					/>
					{errors.violation && (
						<div className="form-error" id="violation-error" style={{ color: 'red', fontSize: '0.9em' }}>
							{errors.violation}
						</div>
					)}
				</div>
				<div>
					<label htmlFor="comments">Comments</label>
					<textarea id="comments" name="comments" value={formData.comments} onChange={handleChange} />
				</div>
				<div>
					<label htmlFor="fine">Fine ($) *</label>
					<input
						id="fine"
						type="text"
						name="fine"
						value={formData.fine}
						onChange={(e) => {
							const value = e.target.value;
							if (/^\d*(\.\d{0,2})?$/.test(value)) {
								handleChange(e);
							}
						}}
						min={0}
						placeholder="0.00"
						aria-invalid={!!errors.fine}
						aria-describedby={errors.fine ? "fine-error" : undefined}
					/>
					{errors.fine && (
						<div className="form-error" id="fine-error" style={{ color: 'red', fontSize: '0.9em' }}>
							{errors.fine}
						</div>
					)}
				</div>
				<div>
					<label htmlFor="officer_id">Officer ID</label>
					<input
						id="officer_id"
						type="text"
						name="officer_id"
						value={formData.officer_id}
						onChange={(e) => {
							const value = e.target.value;
							if (value === '' || /^\d+$/.test(value)) {
								handleChange(e);
							}
						}}
					/>
				</div>
				<div className="form-buttons">
					<button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
					<button type="submit" className="save-button" disabled={submitted}>Submit Ticket</button>
				</div>
			</section>
		</form>
	);
}
