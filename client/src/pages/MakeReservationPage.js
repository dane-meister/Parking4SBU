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

// const HOST = "http://localhost:8000";
const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000"; // Use environment variable for API URL

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
		general_capacity,
		general_availability,
		rates,
		availability: initialAvailability = {},
	} = location.state || {};

	const outletContext = useOutletContext();
	const [times, setTimes] = useState(outletContext?.times ?? getInitialTimes()); // Initialize times with default values


	const [vehicles, setVehicles] = useState([]);
	const [selectedVehicleId, setSelectedVehicleId] = useState(null);

	const [isEventParking, setIsEventParking] = useState(false);
	// Effect to update spot count based on event parking status
	useEffect(() => {
		setSpotCount(isEventParking ? 2 : 1);
	}, [isEventParking]);

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

	const [confirmed, setConfirmed] = useState(false); // State to track if the reservation is confirmed

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

	// Calculate price based on selected times and rates
	useEffect(() => {
		if (!times.arrival || !times.departure || !Array.isArray(rates) || rates.length === 0) return;
	
		const startTime = getDateWithTime(times.arrival);
		const endTime = getDateWithTime(times.departure);

		const selectedRate = rates.find(r => {
			if (isEventParking) {
				return (
					(r.sheet_number != null && r.sheet_price != null) ||
					r.event_parking_price != null ||
					(
						r.hourly != null &&
						r.lot_start_time &&
						r.lot_end_time &&
						r.max_hours != null &&
						r.daily != null
					)
				);
			} 
			else {
				// Standard reservations need hourly, daily, etc.
				return (
				r.hourly != null &&
				r.lot_start_time &&
				r.lot_end_time &&
				r.max_hours != null &&
				r.daily != null
				);
			}
		});

		if (!selectedRate) {
			console.warn("No valid rate found for calculation.");
			setCalculatedPrice(0);
			return;
		}

		let subtotal = 0;

		if (isEventParking) {
			const start = new Date(startTime);
			const end = new Date(endTime);
			const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // Calculate number of days between start and end
			
			const { sheet_number, sheet_price, event_parking_price, hourly, lot_start_time, lot_end_time, max_hours, daily } = selectedRate;
			if (sheet_number != null && sheet_price != null) {
				const sheetsNeeded = Math.ceil(Number(spotCount) / sheet_number);
				subtotal = sheetsNeeded * sheet_price * dayCount;
			} else if (event_parking_price != null) {
				subtotal = event_parking_price * Number(spotCount) * dayCount; // Flat per-spot rate (daily)
			} else if (hourly != null && lot_start_time && lot_end_time && max_hours != null && daily != null) {
				const result = calculateReservationCharge({
					startTime,
					endTime,
					rateStart: lot_start_time,
					rateEnd: lot_end_time,
					hourlyRate: hourly,
					maxHours: max_hours,
					dailyMaxRate: daily
				});
				subtotal = result.subtotal * Number(spotCount);
			} else {
				console.warn("No valid event rate found. Defaulting to $0.");
				subtotal = 0;
			}
		} else {
			// Normal (non-event) reservation
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
		} 
	
		setCalculatedPrice(subtotal);
	}, [times, rates, isEventParking, spotCount]);

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
		general: Infinity,
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

		if (isEventParking && Number(spotCount) > minAvailability[selectedSpotType]) {
			errors.availability = `Only ${minAvailability[selectedSpotType]} ${selectedSpotType.replace('_', ' ')} spots are available.`;
			hasError = true;
		}

		setErrorMessages(errors);  
		if (hasError) return;	  
		
		try {
			const startTime = getDateWithTime(times.arrival);
			const endTime = getDateWithTime(times.departure);

			const now = new Date();
			if (startTime < now) {
				errors.general = "You cannot make a reservation in the past.";
				hasError = true;
			}
			
			const payload = {
				user_id: user?.user_id,
				parking_lot_id: lotId,
				vehicle_id: selectedVehicleId,
				start_time: startTime,
				end_time: endTime,
				total_price: calculatedPrice,
				spot_count: isEventParking ? spotCount : 1,
				event_description: isEventParking ? eventDescription : null,
				spot_type: selectedSpotType
			};
			setConfirmed(true); // Set confirmed to true when reservation is being made
			const res = await axios.post(`${HOST}/api/reservations`, payload, { withCredentials: true });
			setReservationSuccess(true);
			// Immediately fetch latest availability after a successful reservation
			const updatedData = await fetchLotAvailability(startTime, endTime);
			const updatedMatch = updatedData.find(entry => entry.lotId === lotId);
			if (updatedMatch?.hourlyAvailability) {
			setAvailability(updatedMatch.hourlyAvailability);
}
		} catch (err) {
			setConfirmed(false); // Reset confirmed state on error
			console.error("Reservation failed:", err.response?.data || err.message);
			alert("Failed to create reservation. Please try again.");
		}
	};

	const numericKeyDown = (e) => {
		if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
			e.preventDefault();
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
					onKeyDown={numericKeyDown}
					min="2"
					value={spotCount}
					onChange={(e) => setSpotCount(e.target.value)}
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
					<div className="error-text" style={{marginTop: 0, marginBottom: '8px'}}>{errorMessages.eventDescription}</div>
				)}
			</div>
		)}

		{!isEventParking && (
			<div className='make-reservation-lot-box' style={{ paddingBottom: '20px' }}>
				<h4>Vehicle Selection</h4>
				{vehicles.length === 0 ? (
					<div style={{ marginLeft: '25px', color: 'gray', marginRight: '25px' }}>
					No vehicles available.
					<button 
						className='add-vehicle-btn'
						onClick={() => {
							navigate('/profile', { state: { from: 'reservation' } });
						}}
					> 
					Add Vehicle
					</button>
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
					{ key: 'general', label: 'General', capacity: general_capacity },
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
			{errorMessages.general && (
			<div className="error-text" style={{ color: 'red', marginBottom: '10px' }}>
				{errorMessages.general}
			</div>
			)}

			<button 
				className='make-reservation-pay-btn'
				disabled={reservationSuccess === true}
				title={reservationSuccess === true ? "Reservation already made." : ""}
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
					}else if (isEventParking && Number(spotCount) < 2){
						errors.eventDescription = `Events parking has a minimum of 2 spots.`
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
					if (isEventParking && Number(spotCount) > minAvailability[selectedSpotType]) {
						errors.availability = `Only ${minAvailability[selectedSpotType]} ${selectedSpotType.replace('_', ' ')} spots are available.`;
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
				if (reservationSuccess !== true) {
					setReservationSuccess(null);
				}
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
							disabled={confirmed} // Disable button if already confirmed
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
