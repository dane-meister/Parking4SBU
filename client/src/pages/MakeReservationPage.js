import { useState, useEffect } from 'react';
import TimeSelector from '../components/TimeSelector';
import { getInitialTimes } from '../components/Header';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDateWithTime } from '../utils/getDateWithTime';
import { calculateReservationCharge } from '../utils/calculateRate';
import { fetchLotAvailability } from '../utils/fetchLotAvailability';
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
	const [selectedSpotType, setSelectedSpotType] = useState('');

	// Destructure the lot details from the location state
	const {
		lotId,
		lotName,
		covered,
		ev_charging_availability,
		ev_charging_capacity,
		ada_availability,
		ada_capacity,
		faculty_capacity,
		faculty_availability,
		commuter_perimeter_capacity,
		commuter_perimeter_availability,
		commuter_core_capacity,
		commuter_core_availability,
		commuter_satellite_capacity,
		commuter_satellite_availability,
		resident_capacity,
		resident_availability,
		metered_capacity,
		metered_availability,
		rates,
		availability: initialAvailability = {},
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

	const [availability, setAvailability] = useState(initialAvailability);

	const [errorMessages, setErrorMessages] = useState({
		vehicle: '',
		eventDescription: '',
		spotType: '',
		availability: '',
		general: ''
	});

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
	
		const startTime = getDateWithTime(times.arrival);
		const endTime = getDateWithTime(times.departure);

		const selectedRate = rates.find(r =>
			r.hourly != null &&
			r.lot_start_time &&
			r.lot_end_time &&
			r.max_hours != null &&
			r.daily != null
		);

		if (!selectedRate) {
			console.warn("No valid rate found for calculation.");
			setCalculatedPrice(0);
			return;
		}
	
		const { subtotal } = calculateReservationCharge({
			startTime,
			endTime,
			rateStart: selectedRate.lot_start_time,
			rateEnd: selectedRate.lot_end_time,
			hourlyRate: selectedRate.hourly,
			maxHours: selectedRate.max_hours,
			dailyMaxRate: selectedRate.daily
		});
	
		setCalculatedPrice(subtotal);
	}, [times, rates]);

	useEffect(() => {
		const fetchAvailability = async () => {
			try {
				const startTime = getDateWithTime(times.arrival);
				const endTime = getDateWithTime(times.departure);

				const freshData = await fetchLotAvailability(startTime, endTime);  
				const match = freshData.find(entry => entry.lotId === lotId);
				if (match?.hourlyAvailability) {
					setAvailability(match.hourlyAvailability);
				} else {
					setAvailability({});
					console.warn("No availability data found for selected lot.");
				}
			} catch (err) {
				console.error("Failed to fetch updated availability:", err);
				setAvailability({});
			}
		};
		if (lotId && times.arrival && times.departure) {
			fetchAvailability();
		}
	}, [times, lotId]);  

	// Compute min availability during selected range
	const [minAvailability, setMinAvailability] = useState({});

	useEffect(() => {
	const start = new Date(getDateWithTime(times.arrival));
	const end = new Date(getDateWithTime(times.departure));

	const buckets = Object.keys(availability)
		.map(key => new Date(key))
		.filter(date => date >= start && date < end)
		.sort((a, b) => a - b);

	const minMap = {
		faculty: Infinity,
		commuter_core: Infinity,
		commuter_perimeter: Infinity,
		commuter_satellite: Infinity,
		resident: Infinity,
		metered: Infinity,
		ada: Infinity,
		ev_charging: Infinity,
	};

	for (const hour of buckets) {
		const hourKey = hour.toISOString();
		const hourAvailability = availability[hourKey];

		if (!hourAvailability) continue;

		for (const [key, value] of Object.entries(minMap)) {
		const count = hourAvailability[key];
		if (typeof count === "number") {
			minMap[key] = Math.min(minMap[key], count);
		}
		}
	}

	// Replace Infinity with null for spot types that were not present
	Object.entries(minMap).forEach(([key, val]) => {
		if (val === Infinity) minMap[key] = null;
	});

	setMinAvailability(minMap);
	}, [times, availability]);

	// Handles time selection from the TimeSelector component
	const handleTimeSelect = (mode, formatted) => {
		setTimes((prev) => ({ ...prev, [mode]: formatted }));
		setEditingMode(null);
	};

	const confirmReservation = async () => {
		const errors = {
			vehicle: '',
			eventDescription: '',
			spotType: '',
			availability: '',
			general: ''
		};
		let hasError = false;

		if (!selectedVehicleId) {
			errors.vehicle = "Please select a vehicle.";
			hasError = true;
		}
		if (isEventParking && !eventDescription.trim()) {
			errors.eventDescription = "Event description is required for event parking.";
			hasError = true;
		}
		if (!selectedSpotType) {
			errors.spotType = "Please select a spot type.";
			hasError = true;
		}
		if (minAvailability[selectedSpotType] === 0) {
			errors.availability = `No ${selectedSpotType.replace('_', ' ')} spots available during the selected time range.`;
			hasError = true;
		}

		setErrorMessages(errors);  
		if (hasError) return;	  
		
		try {
			const startTime = getDateWithTime(times.arrival);
			const endTime = getDateWithTime(times.departure);
			
			const selectedRate = rates.find(r =>
				r.hourly != null &&
				r.lot_start_time &&
				r.lot_end_time &&
				r.max_hours != null &&
				r.daily != null
			);

			let subtotal = 0;

			if (selectedRate) {
				const result = calculateReservationCharge({
					startTime,
					endTime,
					rateStart: selectedRate.lot_start_time,
					rateEnd: selectedRate.lot_end_time,
					hourlyRate: selectedRate.hourly,
					maxHours: selectedRate.max_hours,
					dailyMaxRate: selectedRate.daily
				});
				subtotal = result.subtotal;
			} else {
				console.warn("No valid rate found for reservation. Defaulting to free.");
			}


			const payload = {
				user_id: user?.user_id,
				parking_lot_id: lotId,
				vehicle_id: selectedVehicleId,
				start_time: startTime,
				end_time: endTime,
				total_price: subtotal,
				spot_count: isEventParking ? spotCount : 1,
				event_description: isEventParking ? eventDescription : null,
				spot_type: selectedSpotType
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
				{/* <hr style={{ border: '1px solid #ADAEB2', margin: '20px 0' }} /> */}
				<label style={{ display: 'inline-block', margin: '20px 0 0 20px' }}>
					<input 
						type="checkbox" 
						checked={isEventParking} 
						onChange={() => setIsEventParking(prev => !prev)}
						id='event-parking'
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
					id='spots-needed'
				/>
				</label>

				<br /><br />

				<label style={{ padding: '0 20px', width: '100%', display: 'inline-block' }}>
					Description:
					<textarea
						required
						rows="2"
						style={{ marginTop: '10px'}}
						value={eventDescription}
						onChange={(e) => setEventDescription(e.target.value)}
						placeholder="e.g. Football Game, Graduation, Guest Lecture..."
						id='event-details'
					/>
				</label>
				{errorMessages.eventDescription && (
					<div className="error-text">{errorMessages.eventDescription}</div>
				)}
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
						id='vehicle-select'
					>
					{vehicles.map(vehicle => (
						<option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
						{vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.plate})
						</option>
					))}
					</select>
				)}
				{errorMessages.vehicle && (
					<div className="error-text">{errorMessages.vehicle}</div>
				)}
			</div>
		)}
		<div className='make-reservation-lot-box'>
			<h4>Spot Type</h4>
			<select
				value={selectedSpotType}
				onChange={(e) => setSelectedSpotType(e.target.value)}
				style={{
					marginLeft: '25px',
					width: '80%',
					padding: '10px',
					fontSize: '16px',
					borderRadius: '5px',
					border: '1px solid #ccc',
				}}
			>
				<option value="">-- Select Spot Type --</option>
				{[
					{ key: 'faculty', label: 'Faculty', capacity: faculty_capacity },
					{ key: 'commuter_core', label: 'Commuter Core', capacity: commuter_core_capacity },
					{ key: 'commuter_perimeter', label: 'Commuter Perimeter', capacity: commuter_perimeter_capacity },
					{ key: 'commuter_satellite', label: 'Commuter Satellite', capacity: commuter_satellite_capacity },
					{ key: 'resident', label: 'Resident', capacity: resident_capacity },
					{ key: 'metered', label: 'Metered', capacity: metered_capacity },
					{ key: 'ada', label: 'ADA', capacity: ada_capacity },
					{ key: 'ev_charging', label: 'EV Charging', capacity: ev_charging_capacity },
					]
					.filter(type => type.capacity > 0)
					.map(({ key, label, capacity }) => {
						const available = minAvailability[key];
						const display = available != null ? `${available} / ${capacity}` : `unknown / ${capacity}`;
						return (
						<option key={key} value={key}>
							{label} ({display} available)
						</option>
						);
				})}
			</select>
			{errorMessages.spotType && (
				<div className="error-text">{errorMessages.spotType}</div>
			)}
			{errorMessages.availability && (
			<div className="error-text">{errorMessages.availability}</div>
		)}
		<div style={{margin:'20px'}}></div>
		</div>
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
					const errors = {
						vehicle: '',
						eventDescription: '',
						spotType: '',
						availability: '',
						general: ''
					};
					let hasError = false;

					if (!selectedVehicleId) {
						errors.vehicle = "Please select a vehicle.";
						hasError = true;
					}
					if (isEventParking && !eventDescription.trim()) {
						errors.eventDescription = "Event description is required for event parking.";
						hasError = true;
					}
					if (!selectedSpotType) {
						errors.spotType = "Please select a spot type.";
						hasError = true;
					}
					if (minAvailability[selectedSpotType] === 0) {
						errors.availability = `No ${selectedSpotType.replace('_', ' ')} spots available during the selected time range.`;
						hasError = true;
					}

					setErrorMessages(errors);

					if (!hasError) {
						setShowConfirmPopup(true);
					}
				}}
			>
				Make Reservation
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
						<p><strong>Spot Type:</strong> {selectedSpotType}</p>
						{isEventParking && (
							<>
								<p><strong>Spots:</strong> {spotCount}</p>
								<p><strong>Event:</strong> {eventDescription}</p>
							</>
						)}
						<p><strong>Total:</strong> ${(calculatedPrice).toFixed(2)}</p>
					</div>

					<div className="reservation-confirm-popup-buttons">
						<button 
							onClick={() => setShowConfirmPopup(false)} 
							className="reservation-cancel-btn"
							autoFocus // eslint-disable-line jsx-a11y/no-autofocus
						>
							Cancel
						</button>
						<button 
							onClick={confirmReservation} 
							className="reservation-confirm-btn"
						>
							Confirm
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
