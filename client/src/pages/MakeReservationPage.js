import { useState, useEffect } from 'react';
import TimeSelector from '../components/TimeSelector';
import { getInitialTimes } from '../components/Header';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDateWithTime } from '../utils/getDateWithTime';
import { calculateReservationCharge } from '../utils/calculateRate';
import Popup from '../components/Popup';
import axios from 'axios';
import '../stylesheets/MakeReservation.css' // Import the CSS stylesheet for styling the ReservationPage component

const HOST = "http://localhost:8000";

function Reservation(){
	const { user } = useAuth(); // Access the current user from AuthContext
	const navigate = useNavigate(); // Hook to programmatically navigate
	const location = useLocation(); // Get the current location from React Router

	const [showConfirmPopup, setShowConfirmPopup] = useState(false);
	const [reservationSuccess, setReservationSuccess] = useState(null);

	console.log("Full location.state", location.state);

	// Destructure the lot details from the location state
	const {
		lotId,
		lotName,
		covered,
		ev_charging_availability,
		ada_availability,
		rates,
	} = location.state || {};

	const outletContext = useOutletContext();
	const [times, setTimes] = useState(outletContext?.times ?? getInitialTimes()); // Initialize times with default values


	const [vehicles, setVehicles] = useState([]);
	const [selectedVehicleId, setSelectedVehicleId] = useState(null);

	const [isEventParking, setIsEventParking] = useState(false);
	const [spotCount, setSpotCount] = useState(1);
	const [eventDescription, setEventDescription] = useState('');

	// State to track which time (arrival or departure) is being edited
	const [editingMode, setEditingMode] = useState(null); 

	const [calculatedPrice, setCalculatedPrice] = useState(0);


	// Fetch vehicles and auto-select default on mount
	useEffect(() => {
		if (!user?.user_id) return; // Exit if user ID is not available
		// Fetch vehicles associated with the user
		axios.get(`${HOST}/api/auth/${user.user_id}/vehicles`, { withCredentials: true })
			.then((res) => {
				setVehicles(res.data.vehicles);
				const defaultVehicle = res.data.vehicles.find(v => v.isDefault);
				if (defaultVehicle) {
					setSelectedVehicleId(defaultVehicle.vehicle_id);
				} else if (res.data.vehicles.length > 0) {
					setSelectedVehicleId(res.data.vehicles[0].vehicle_id); // fallback
				}
			})
			.catch((err) => {
				console.error("Failed to fetch vehicles", err);
			});
	}, [user?.user_id]);

	useEffect(() => {
		if (!times.arrival || !times.departure || !Array.isArray(rates) || rates.length === 0) return;
	
		const rate = rates[0]; // TODO: replace with actual rate selection logic if needed
	
		if (!rate.lot_start_time || !rate.lot_end_time || rate.hourly == null || rate.daily == null || rate.max_hours == null) {
			console.warn("Incomplete rate data");
			return;
		}
	
		const startTime = getDateWithTime(times.arrival);
		const endTime = getDateWithTime(times.departure);
	
		const { subtotal } = calculateReservationCharge({
			startTime,
			endTime,
			rateStart: rate.lot_start_time,
			rateEnd: rate.lot_end_time,
			hourlyRate: rate.hourly,
			maxHours: rate.max_hours,
			dailyMaxRate: rate.daily
		});
	
		setCalculatedPrice(subtotal);
	}, [times, rates]);
	
	

	// Handles time selection from the TimeSelector component
	const handleTimeSelect = (mode, formatted) => {
		setTimes((prev) => ({ ...prev, [mode]: formatted }));
		setEditingMode(null);
	};

	const confirmReservation = async () => {
		if (!selectedVehicleId) {
			alert("Please select a vehicle.");
			return;
		}
		if (isEventParking && !eventDescription.trim()) {
			alert("Please enter an event description.");
			return;
		}  
		try {
			const startTime = getDateWithTime(times.arrival);
			const endTime = getDateWithTime(times.departure);
			
			const rate = rates[0] || {};
			const { subtotal } = calculateReservationCharge({
				startTime,
				endTime,
				rateStart: rate.lot_start_time,
				rateEnd: rate.lot_end_time,
				hourlyRate: rate.hourly,
				maxHours: rate.max_hours,
				dailyMaxRate: rate.daily
			});

			const payload = {
				user_id: user?.user_id,
				parking_lot_id: lotId,
				vehicle_id: selectedVehicleId,
				start_time: startTime,
				end_time: endTime,
				total_price: subtotal,
				spot_count: isEventParking ? spotCount : 1,
				event_description: isEventParking ? eventDescription : null
			};
			const res = await axios.post(`${HOST}/api/reservations`, payload, { withCredentials: true });
			console.log("Reservation successful:", res.data);
			setReservationSuccess(true);
		} catch (err) {
			console.error("Reservation failed:", err.response?.data || err.message);
			alert("Failed to create reservation. Please try again.");
		}
	};

	return (<section className='make-reservation-page'>
		<section className='make-reservation-left'>
			<div className='make-reservation-lot-box'>
				<h3>{lotName ?? 'Selected Lot'}</h3>
				{ada_availability > 0 && (
					<div className='make-reservation-info-row'>
						<img src='/images/disability_icon.png' alt='has disability parking icon'/>
						<span>Disability Parking</span>
					</div>
				)}
				{ev_charging_availability > 0 && (
					<div className='make-reservation-info-row'>
						<img src='/images/ev_icon.png' alt='has EV charger icon'/>
						<span>EV Charging</span>
					</div>
				)}
				{covered && (
					<div className='make-reservation-info-row'>
						<span>Covered Lot</span>
					</div>
				)}
			</div>

			<div className='make-reservation-lot-box' style={{paddingBottom: '20px', borderBottom: 'solid 1px #ADAEB2'}}>
				<h4>Parking Time</h4>
				<div className="time-selector-container">
					<div className="time-input">
						<span className="time-label" style={{color: 'black'}}>Arrive After:</span>
						<div className="time-row">
							{/* Display arrival time and edit button */}
							<span className="time-value" style={{color: 'black'}}>{times.arrival}</span>
							<button className="edit-button" onClick={() => setEditingMode("arrival")}>
								<img src="/images/edit-icon.png" alt="Edit Arrival" className="edit-icon" style={{filter: 'brightness(0)'}}/>
							</button>
						</div>
					</div>

					<div className="arrow-container">
						{/* Arrow icon between arrival and departure times */}
						<img src="/images/arrow-icon.png" alt="Arrow" className="arrow-icon" style={{filter: 'brightness(0)'}}/>
					</div>
					
					<div className="time-input">
						<span className="time-label" style={{color: 'black'}}>Exit Before:</span>
						<div className="time-row">
							{/* Display departure time and edit button */}
							<span className="time-value" style={{color: 'black'}}>{times.departure}</span>
							<button className="edit-button" onClick={() => setEditingMode("departure")}>
								<img src="/images/edit-icon.png" alt="Edit Departure" className="edit-icon" style={{filter: 'brightness(0)'}}/>
							</button>
						</div>
					</div>
				</div>
				<hr style={{ border: '1px solid #ADAEB2', margin: '20px 0' }} />
				<label style={{ marginLeft: '20px' }}>
					<input 
					type="checkbox" 
					checked={isEventParking} 
					onChange={() => setIsEventParking(prev => !prev)} 
					/>
					<span style={{ marginLeft: '8px' }}>Event Parking</span>
				</label>
			</div>


		{isEventParking && (
			<div className='make-reservation-lot-box'>
				<h4>Event Details</h4>
				
				<label style={{ marginLeft: '20px' }}>
				Spots Needed:
				<input
					type="number"
					min="1"
					value={spotCount}
					onChange={(e) => setSpotCount(Number(e.target.value))}
					style={{ marginLeft: '10px', width: '60px' }}
				/>
				</label>

				<br /><br />

				<label style={{ marginLeft: '20px' }}>
				Description:
				<textarea
					required
					rows="2"
					style={{ marginTop: '10px', width: '90%' }}
					value={eventDescription}
					onChange={(e) => setEventDescription(e.target.value)}
					placeholder="e.g. Football Game, Graduation, Guest Lecture..."
				/>
				</label>
			</div>
		)}

		{!isEventParking && (
			<div className='make-reservation-lot-box' style={{ paddingBottom: '20px' }}>
				<h4>Vehicle Selection</h4>
				{vehicles.length === 0 ? (
					<div style={{ marginLeft: '25px', color: 'gray' }}>
					No vehicles available.
					</div>
				) : (
					<select
					value={selectedVehicleId || ''}
					onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
					style={{
						marginLeft: '25px',
						width: '80%',
						padding: '8px',
						fontSize: '16px',
						borderRadius: '5px',
						border: '1px solid #ccc'
					}}
					>
					{vehicles.map(vehicle => (
						<option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
						{vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.plate})
						</option>
					))}
					</select>
				)}
			</div>
		)}

		</section>

		<section className='make-reservation-right'>
			<h4>Payment Summary</h4>
			<div className='make-reservation-payment-row'>
				<span>Subtotal</span>
				<span>${calculatedPrice.toFixed(2)}</span>
			</div>
			<div className='make-reservation-total'>
				<span>Order Total</span>
				<span>${calculatedPrice.toFixed(2)}</span>
			</div>
			<div>
			<button 
				className='make-reservation-pay-btn'
				onClick={() => {
					if (!selectedVehicleId) return alert("Please select a vehicle.");
					if (isEventParking && !eventDescription.trim()) return alert("Please enter an event description.");
					setShowConfirmPopup(true);
				}}
			>
				Pay with Card
			</button>

			</div>
		</section>

		{editingMode && (
			<TimeSelector
				mode={editingMode}
				initialTimes={times}
				onSelect={handleTimeSelect}
				onClose={() => setEditingMode(null)}
			/>
	)}
	{showConfirmPopup && (
		<Popup
			name="reservation-confirm"
			popupHeading="Confirm Reservation"
			closeFunction={() => {
				setShowConfirmPopup(false);
				setReservationSuccess(null);
			}}
		>
			{reservationSuccess === null ? (
				<>
					<div className="reservation-confirm-popup-body">
						<p><strong>Lot:</strong> {lotName}</p>
						<p><strong>Arrival:</strong> {times.arrival}</p>
						<p><strong>Departure:</strong> {times.departure}</p>
						<p><strong>Vehicle:</strong> {
							vehicles.find(v => v.vehicle_id === selectedVehicleId)?.plate
						}</p>
						{isEventParking && (
							<>
								<p><strong>Spots:</strong> {spotCount}</p>
								<p><strong>Event:</strong> {eventDescription}</p>
							</>
						)}
						<p><strong>Total:</strong> ${(calculatedPrice * 1.08725).toFixed(2)}</p>
					</div>

					<div className="reservation-confirm-popup-buttons">
						<button 
							onClick={confirmReservation} 
							className="reservation-confirm-btn"
						>
							Confirm
						</button>
						<button 
							onClick={() => setShowConfirmPopup(false)} 
							className="reservation-cancel-btn"
						>
							Cancel
						</button>
					</div>
				</>
			) : reservationSuccess ? (
				<div className="reservation-confirm-popup-body">
					<p style={{ color: 'green' }}>Reservation successfully created!</p>
					<div className="reservation-confirm-popup-buttons">
						<button 
							onClick={() => {
								setShowConfirmPopup(false);
								navigate("/reservations");
							}} 
							className="reservation-confirm-btn"
						>
							Go to My Reservations
						</button>
					</div>
				</div>
			) : (
				<div className="reservation-confirm-popup-body">
					<p style={{ color: 'red' }}>Reservation failed. Please try again.</p>
					<div className="reservation-confirm-popup-buttons">
						<button 
							onClick={() => {
								setShowConfirmPopup(false);
								setReservationSuccess(null);
							}} 
							className="reservation-cancel-btn"
						>
							Close
						</button>
					</div>
				</div>
			)}
		</Popup>
	)}


	</section>);
	
}

export default Reservation; // Export the component for use in other parts of the application
