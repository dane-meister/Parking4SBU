import { useState } from 'react';
import TimeSelector from '../components/TimeSelector';
import { getInitialTimes } from '../components/Header';
import '../stylesheets/MakeReservation.css' // Import the CSS stylesheet for styling the ReservationPage component

function Reservation(){
	const [times, setTimes] = useState(getInitialTimes());
  // State to track which time (arrival or departure) is being edited
  const [editingMode, setEditingMode] = useState(null); 
  // React Router hook to get the current location
  // const location = useLocation(); 

  // Handles time selection from the TimeSelector component
  const handleTimeSelect = (mode, formatted) => {
    setTimes((prev) => ({
      ...prev,
      [mode]: formatted,
    }));
    setEditingMode(null); // Exit editing mode after selection
  };

	return (<section className='make-reservation-page'>
		<section className='make-reservation-left'>
			<div className='make-reservation-lot-box'>
				<h3>Lot 27B</h3>
				<div className='make-reservation-info-row'>
					<img src='/images/disability_icon.png' alt='has disability parking icon'/>
					<span>Disability Parking</span>
				</div>
				<div className='make-reservation-info-row'>
					<img src='/images/ev_icon.png' alt='has disability parking icon'/>
					<span>EV Charging</span>
				</div>
				<div className='make-reservation-info-row'  style={{marginTop: '-1px', marginBottom: '20px'}}>
					<span>Covered Lot</span>
				</div>
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
			</div>

			<div className='make-reservation-lot-box' style={{paddingBottom: '20px'}}>
				<h4>Vehicle Selection</h4>
				<div style={{marginLeft: '25px', color: 'gray'}}>Vehicle Select To Be Implemented</div>
			</div>
		</section>

		<section className='make-reservation-right'>
			<h4>Payment Summary</h4>
			<div className='make-reservation-payment-row'>
				<span>Subtotal</span>
				<span>$10.50</span>
			</div>
			<div className='make-reservation-payment-row'>
				<span>Taxes</span>
				<span>${Math.round(10.50 * .08725 * 100) / 100}</span>
			</div>
			<div className='make-reservation-total'>
				<span>Order Total</span>
				<span>${10.50 + Math.round(10.50 * .08725 * 100) / 100}</span>
			</div>
			<div>
				<button className='make-reservation-pay-btn'>Pay with Card</button>
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
	</section>);
}

export default Reservation; // Export the component for use in other parts of the application
