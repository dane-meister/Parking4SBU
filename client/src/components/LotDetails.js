import '../stylesheets/LotDetails.css'

export default function LotDetails(props) {
	// Destructure props to extract lot image source and lot object
	const { lotImgSrc, lotObj } = props;

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
		rate,
		time
	} = lotObj;

	// Render the lot details section
	return (
		<section className='lot-details'>
			{/* Section for displaying selected lot's basic information */}
			<section className='selected-lot-info hbox wide'>
				<div className='selected-lot-text flex'>
					{/* Display lot name or fallback to 'Unknown Lot' */}
					<div className='selected-lot-name'>{name ?? 'Unknown Lot'}</div>

					{/* Display lot rate and time */}
					<div className='selected-lot-price-time'>
						<span className='selected-lot-price'>{rate ?? 'Rate'}</span>
						<span className='selected-lot-time'>{time ?? 'Time'}</span>
					</div>

					{/* Display disability parking availability if applicable */}
					{(ada_availability > 0) && (
						<div className='selected-lot-disability'>
							<img
								className='selected-lot-icon'
								src='/images/disability_icon.png'
								alt='disability parking icon'
							/>
							<span>Disability parking</span>
						</div>
					)}

					{/* Display EV charger availability if applicable */}
					{(ev_charging_capacity) && (
						<div className='selected-lot-ev'>
							<img
								className='selected-lot-icon'
								src='/images/ev_icon.png'
								alt='available ev chargers icon'
							/>
							<span>EV charger</span>
						</div>
					)}

					{/* Display whether the lot is covered or uncovered */}
					<div className='selected-lot-covered'>
						{(covered ? 'Covered' : 'Uncovered') + ' Lot'}
					</div>
				</div>

				{/* Placeholder for lot image (currently commented out) */}
				{/* <img 
					src={lotImgSrc ?? '/images/lots/placeholder_lot.png'} 
					className='selected-lot-img'
					alt='lot'
				/> */}
			</section>

			<hr />

			{/* Section for displaying extended lot information */}
			<section className='selected-lot-extended-info'>
				{/* Display available spots information */}
				<div className='selected-lots-available'>20+ spots available now</div>

				{/* Button to book a reservation */}
				<button className='selected-lot-book-btn pointer'>Book a reservation now!</button>
			</section>

			<hr />
		</section>
	);
}