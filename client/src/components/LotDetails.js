import '../stylesheets/LotDetails.css'

export default function InformationSystems(props){
	const { lotImgSrc, lotObj } = props;
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

	return (<section className='lot-details'>
		<section className='selected-lot-info hbox wide'>
			<div className='selected-lot-text flex'>
				
				<div className='selected-lot-name'>{name ?? 'Unknown Lot'}</div>
				<div className='selected-lot-price-time'>
					<span className='selected-lot-price'>{rate ?? 'Rate'}</span>
					<span className='selected-lot-time'>{time ?? 'Time'}</span>
				</div>
				{ (ada_availability > 0) &&
					<div className='selected-lot-disability'>
						<img 
							className='selected-lot-icon' 
							src='/images/disability_icon.png'
							alt='disability parking icon'
						/>
						<span>Disability parking</span>
					</div>
				}
				{ (ev_charging_capacity) && 
					<div className='selected-lot-ev'>
						<img 
							className='selected-lot-icon' 
							src='/images/ev_icon.png'
							alt='available ev chergers icon'
						/>
						<span>EV charger</span>
					</div>
				}
				<div className='selected-lot-covered'>{(covered ? 'Covered' : 'Uncovered') + ' Lot'}</div>
			</div>
			{/* <img 
				src={lotImgSrc ?? '/images/lots/placeholder_lot.png'} 
				className='selected-lot-img'
				alt='lot'
			/> */}
		</section>
		<hr />
		<section className='selected-lot-extended-info'>
			<div className='selected-lots-available'>20+ spots available now</div>
			{/* Schedule: */}
			{/* <ul style={{marginTop: '0px'}}> */}
			{/* 	<li> */}
			{/* 		<span>Free Faculty/Hourly Paid: </span> */}
			{/* 		<span style={{color: 'var(--medium-gray)'}}>6am-4pm Mon-Fri</span> */}
			{/* 	</li> */}
			{/* 	<li> */}
			{/* 		<span>Free Faculty/Hourly Paid: </span> */}
			{/* 		<span style={{color: 'var(--medium-gray)'}}>6am-4pm Mon-Fri</span> */}
			{/* 	</li> */}
			{/* 	<li> */}
			{/* 		<span>Free Faculty/Hourly Paid: </span> */}
			{/* 		<span style={{color: 'var(--medium-gray)'}}>6am-4pm Mon-Fri</span> */}
			{/* 	</li> */}
			{/* </ul> */}
			<button className='selected-lot-book-btn pointer'>Book a reservation now!</button>

		</section>
		<hr />
	</section>);
}