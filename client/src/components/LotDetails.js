import '../stylesheets/LotDetails.css'
import { formatTimeRange } from '../utils/formatTime';
import { useNavigate } from 'react-router-dom';

export default function LotDetails({ lotObj, rateType }) {

	const navigate = useNavigate(); // Hook to programmatically navigate

	// Destructure lotObj to extract individual lot details
	const {
		ada_availability,
		ada_capacity,
		capacity,
		commuter_core_availability,
		commuter_core_capacity,
		commuter_perimeter_availability,
		commuter_perimeter_capacity,
		commuter_satellite_availability,
		commuter_satellite_capacity,
		covered,
		ev_charging_availability,
		ev_charging_capacity,
		faculty_availability,
		faculty_capacity,
		id,
		metered_availability,
		metered_capacity,
		name,
		resident_availability,
		resident_capacity,
		resident_zone,
		Rates = [],
	} = lotObj;


	const rateFields = {
		hourly: 'Hourly',
		daily: 'Daily',
		monthly: 'Monthly',
		semesterly_fall_spring: 'Semesterly (Fall/Spring)',
		semesterly_summer: 'Semesterly (Summer)',
		yearly: 'Yearly',
	};

	const formatRate = (value) => {
		if (value === 0) return "Free";
		if (value == null) return "N/A";
		return `$${value.toFixed(2)}`;
	};

	const handleReservationClick = () => {
		navigate('/reservation', {
			state: {
				lotId: id,
				lotName: name,
				covered,
				ev_charging_availability,
				ada_availability,
				rates: Rates,
				defaultTimeRange: {
					// Optionally you could pass default time window based on rate schedule
					start: Rates[0]?.lot_start_time ?? null,
					end: Rates[0]?.lot_end_time ?? null,
				}
			}
		});
	};

	// Render the lot details section
	return (
		<section className='lot-details'>
			{/* Basic Lot Info */}
			<section className='selected-lot-info hbox wide'>
				<div className='selected-lot-text flex'>
					<div className='selected-lot-name'>{name ?? 'Unknown Lot'}</div>

					{/* Display EV and ADA availability */}
					{(ada_availability > 0) && (
						<div className='selected-lot-disability'>
							<img className='selected-lot-icon' src='/images/disability_icon.png' alt='ADA icon' />
							<span>Disability parking</span>
						</div>
					)}
					{(ev_charging_capacity > 0) && (
						<div className='selected-lot-ev'>
							<img className='selected-lot-icon' src='/images/ev_icon.png' alt='EV charger icon' />
							<span>EV charger</span>
						</div>
					)}

					<div className='selected-lot-covered'>
						{covered ? 'Covered Lot' : 'Uncovered Lot'}
					</div>
				</div>
			</section>

			<hr />

			{/* Rate Info Section */}
			<section className='lot-rates-section'>
				<h4 className='lot-rates-title'>Rates</h4>
				{Rates.length === 0 ? (
					<div>No rate information available.</div>
				) : (
					Rates.map((rate, idx) => (
						<div key={idx} className='lot-rate-block'>
							<div className='rate-header'>
								{rate.permit_type}
								{rate.permit_type.toLowerCase().includes('resident') && lotObj.resident_zone
								? ` (Zone ${Number(lotObj.resident_zone)})`
								: ''}
								<span className='rate-time'>
									{formatTimeRange(rate.lot_start_time, rate.lot_end_time)}
								</span>
							</div>
							<ul className='rate-list'>
								{Object.entries(rateFields).map(([key, label]) => {
									const value = rate[key];
									if (value === null || value === undefined) return null;
									return (
									<li key={key}>
										{label}: {formatRate(value)}
									</li>
									);
								})}
							</ul>
						</div>
					))
				)}
			</section>

			<hr />

			{/* Lot Capacity Info Section */}
			<section className='lot-capacity-section'>
			<h4 className='lot-rates-title'>Capacity</h4>
			<ul className='rate-list'>
				{faculty_capacity > 0 && (
				<li>Faculty: {faculty_availability} / {faculty_capacity}</li>
				)}
				{commuter_core_capacity > 0 && (
				<li>Commuter Core: {commuter_core_availability} / {commuter_core_capacity}</li>
				)}
				{commuter_perimeter_capacity > 0 && (
				<li>Commuter Perimeter: {commuter_perimeter_availability} / {commuter_perimeter_capacity}</li>
				)}
				{commuter_satellite_capacity > 0 && (
				<li>Commuter Satellite: {commuter_satellite_availability} / {commuter_satellite_capacity}</li>
				)}
				{resident_capacity > 0 && (
				<li>Resident: {resident_availability} / {resident_capacity}</li>
				)}
				{metered_capacity > 0 && (
				<li>Metered: {metered_availability} / {metered_capacity}</li>
				)}
				{ada_capacity > 0 && (
				<li>ADA: {ada_availability} / {ada_capacity}</li>
				)}
				{ev_charging_capacity > 0 && (
				<li>EV Charging: {ev_charging_availability} / {ev_charging_capacity}</li>
				)}
				{capacity > 0 && (
				<li><strong>Total: </strong>{capacity} Available Spaces</li>
				)}
			</ul>
			</section>

			{/* Booking / Action */}
			<section className='selected-lot-extended-info'>
				<button 
					className='selected-lot-book-btn pointer'
					onClick={handleReservationClick}
				>Book a reservation now!</button>
			</section>

			<hr />
		</section>
	);
}