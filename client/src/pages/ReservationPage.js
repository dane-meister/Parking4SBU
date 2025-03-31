import '../stylesheets/Reservation.css' // Import the CSS stylesheet for styling the ReservationPage component

function Reservation(){
	return (<section className='make-reservation-page' style={{height: 'calc(100vh - 220px'}}>
		<div className='make-reservation-left'>
			<div className='make-reservation-box'>
				Vehicle
			</div>
			<hr/>
			<div className='make-reservation-box'>
				Vehicle 2
			</div>
		</div>
		<div className='make-reservation-right'>
			<section>$20</section>
		</div>
	</section>);
}

export default ReservationPage; // Export the component for use in other parts of the application
