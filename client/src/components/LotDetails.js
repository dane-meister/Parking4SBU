import '../stylesheets/LotDetails.css'
import { formatTimeRange } from '../utils/formatTime';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { getInitialTimes } from './Header';
import PopularTimes from '../components/PopularTimes';

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
		general_availability,
		general_capacity,
		name,
		resident_availability,
		resident_capacity,
		resident_zone,
		Rates = [],
		availability = {},
	} = lotObj;


	// Compute minimum available per spot type across entire selected range
	const minAvailability = {
		faculty: Infinity,
		commuter_core: Infinity,
		commuter_perimeter: Infinity,
		commuter_satellite: Infinity,
		resident: Infinity,
		metered: Infinity,
		ada: Infinity,
		ev_charging: Infinity,
		general: Infinity,
		total: Infinity,
	};

	Object.values(availability).forEach(hourBlock => {
		for (const [key, value] of Object.entries(hourBlock)) {
			if (minAvailability[key] !== undefined) {
				minAvailability[key] = Math.min(minAvailability[key], value);
			}
		}
	});

	// Replace Infinity with null if no data was found
	Object.keys(minAvailability).forEach(key => {
		if (minAvailability[key] === Infinity) {
			minAvailability[key] = null;
		}
	});

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
				rates: Rates,
				availability,
				defaultTimeRange: times,
			}
		});
	};

	const outletContext = useOutletContext();
	const [times, setTimes] = useState(outletContext?.times ?? getInitialTimes());

	function parseCustomDate(dateStr) {

		const [dayPart] = dateStr.split('|');
		const trimmed = dayPart.trim();

		const currentYear = new Date().getFullYear();

		const reformatted = `${trimmed}, ${currentYear}`;

		return new Date(reformatted);
	}

	const defaultDay = parseCustomDate(times.arrival).toLocaleDateString('en-US', { weekday: 'long' })



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

			{/* Lot Capacity Info Section */}
			<section className='lot-capacity-section'>
				<h4 className='lot-rates-title'>Capacity</h4>
				<ul className='rate-list'>
					{faculty_capacity > 0 && (
						<li>Faculty: {minAvailability.faculty ?? faculty_availability} / {faculty_capacity}</li>
					)}
					{commuter_core_capacity > 0 && (
						<li>Commuter Core: {minAvailability.commuter_core ?? commuter_core_availability} / {commuter_core_capacity}</li>
					)}
					{commuter_perimeter_capacity > 0 && (
						<li>Commuter Perimeter: {minAvailability.commuter_perimeter ?? commuter_perimeter_availability} / {commuter_perimeter_capacity}</li>
					)}
					{commuter_satellite_capacity > 0 && (
						<li>Commuter Satellite: {minAvailability.commuter_satellite ?? commuter_satellite_availability} / {commuter_satellite_capacity}</li>
					)}
					{resident_capacity > 0 && (
						<li>Resident: {minAvailability.resident ?? resident_availability} / {resident_capacity}</li>
					)}
					{metered_capacity > 0 && (
						<li>Metered: {minAvailability.metered ?? metered_availability} / {metered_capacity}</li>
					)}
					{general_capacity > 0 && (
						<li>General: {minAvailability.general ?? general_availability} / {general_capacity}</li>
					)}
					{ada_capacity > 0 && (
						<li>ADA: {minAvailability.ada ?? ada_availability} / {ada_capacity}</li>
					)}
					{ev_charging_capacity > 0 && (
						<li>EV Charging: {minAvailability.ev_charging ?? ev_charging_availability} / {ev_charging_capacity}</li>
					)}
					{capacity > 0 && (
						<li><strong>Total:</strong> {minAvailability.total ?? 'unknown'} / {capacity} Available</li>
					)}
				</ul>
			</section>
			<section className="lot-popular-times">
				<h4>Popular Times Forecast</h4>
				<PopularTimes lotId={id} selectedDay={new Date(times.arrival).toLocaleDateString('en-US', { weekday: 'long' })} />
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