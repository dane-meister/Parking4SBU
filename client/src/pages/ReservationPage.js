import '../stylesheets/Reservation.css' // Import the CSS stylesheet for styling the ReservationPage component

// Define the ReservationPage functional component
function ReservationPage() {
	return (
		// Main section with a class and inline style for height adjustment
		<section className='reservation-page' style={{ height: 'calc(100vh - 220px' }}>
			{/* Left section for displaying reservation details */}
			<div className='reservation-left'>
				{/* Box for the first vehicle */}
				<div className='reservation-box'>
					Vehicle
				</div>
				<hr /> {/* Horizontal line separator */}
				{/* Box for the second vehicle */}
				<div className='reservation-box'>
					Vehicle 2
				</div>
			</div>
			{/* Right section for displaying pricing or other details */}
			<div className='reservation-right'>
				<section>$20</section> {/* Display price */}
			</div>
		</section>
	);
}

export default ReservationPage; // Export the component for use in other parts of the application
