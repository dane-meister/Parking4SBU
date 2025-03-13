import '../stylesheets/InformationSystems.css'

export default function InformationSystems(props){
	const { lotImgSrc } = props;

	return (<section className='information-systems'>
		<section className='selected-lot-info hbox wide'>
			<div className='selected-lot-text flex'>
				
				<div className='selected-lot-name'>Lot 36B</div>
				<div className='selected-lot-price-time'>
					<span className='selected-lot-price'>$2.25 / hr</span>
					<span className='selected-lot-time'>6am-4pm</span>
				</div>
				<div className='selected-lot-disability'>
					<img 
						className='selected-lot-icon' 
						src='/images/disability_icon.png'
						alt='disability parking icon'
					/>
					<span>Disability parking</span>
				</div>
				<div className='selected-lot-ev'>
					<img 
						className='selected-lot-icon' 
						src='/images/ev_icon.png'
						alt='available ev chergers icon'
					/>
					<span>Disability parking</span>
				</div>
				<div className='selected-lot-covered'>Uncovered Lot</div>
			</div>
			<img 
				src={lotImgSrc ?? '/images/lots/placeholder_lot.png'} 
				className='selected-lot-img'
				alt='lot'
			/>
		</section>
		<hr />
		<section className='selected-lot-extended-info'>
			<div className='selected-lots-available'>20+ spots available now</div>
			Schedule:
			<ul style={{marginTop: '0px'}}>
				<li>
					<span>Free Faculty/Hourly Paid: </span>
					<span style={{color: 'var(--medium-gray)'}}>6am-4pm Mon-Fri</span>
				</li>
				<li>
					<span>Free Faculty/Hourly Paid: </span>
					<span style={{color: 'var(--medium-gray)'}}>6am-4pm Mon-Fri</span>
				</li>
				<li>
					<span>Free Faculty/Hourly Paid: </span>
					<span style={{color: 'var(--medium-gray)'}}>6am-4pm Mon-Fri</span>
				</li>
			</ul>
			<button className='selected-lot-book-btn pointer'>Book a reservation now!</button>

		</section>
		<hr />
	</section>);
}