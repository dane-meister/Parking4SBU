import React, { useState } from 'react';
import '../stylesheets/Popup.css';

export default function Popup({ children, close }){
	const [visible, setVisible] = useState(false);
	


	return (<section className='popup-container'>
		<section className='dim' />
		<section className='popup'>
			<div className='hbox'>
				<span><b>Filters</b></span>
				<span className='flex'/>
				<img 
					className='popup-x' 
					src='/images/x.png' 
					alt='close'
					onClick={close}
				/>
			</div>
			{children}
		</section>

	</section>); 
}