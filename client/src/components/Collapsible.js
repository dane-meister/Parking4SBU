import React, { useState } from 'react';

export default function Collapsible({ className, name, imgsrc, children, startOpen, tag }){
	startOpen = startOpen !== undefined ? startOpen : true //default true
	const [open, setOpen] = useState(startOpen);
	
	const toggleOpen = () => {
		setOpen(!open);
	};

	const imgStyle = {
		transform: open ? 'rotate(180deg)' : '',
		transition: 'transform 50ms ease',
		cursor: 'pointer'
	}

	return (
		<div className={className}>
			<div style={{display: 'flex'}}>
				<span className={className+'-name'}>{name}</span>
				{tag !== undefined && tag}
				<span style={{flex: 1}}/>
				<img 
					className={name.toLowerCase() + '-img'} 
					src={imgsrc ? imgsrc : '/images/chevron.webp'}
					style={imgStyle}
					onClick={toggleOpen}
					alt='collapse section'
				/>
			</div>
			{open && <div>{children}</div>}
		</div>
	);
}
