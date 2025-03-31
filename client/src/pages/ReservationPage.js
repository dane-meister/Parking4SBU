import '../stylesheets/Reservation.css'

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
export default Reservation;
