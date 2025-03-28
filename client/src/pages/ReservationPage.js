import '../stylesheets/Reservation.css'

function Reservation(){
	return (<section className='reservation-page' style={{height: 'calc(100vh - 220px'}}>
		<div className='reservation-left'>
			<div className='reservation-box'>
				Vehicle
			</div>
			<hr/>
			<div className='reservation-box'>
				Vehicle 2
				</div>
		</div>
		<div className='reservation-right'>
			<section>$20</section>
		</div>
	</section>);
}
export default Reservation;
