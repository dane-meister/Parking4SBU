import React, { useEffect, useState } from 'react';

// Collapsible component: A reusable component that can toggle the visibility of its children.
// Props:
// - className: CSS class for the outermost div.
// - name: Name or title displayed in the collapsible header.
// - imgsrc: Source URL for the toggle icon (defaults to a chevron image).
// - children: Content to display inside the collapsible section.
// - startOpen: Boolean to determine if the collapsible starts open (default: true).
// - tag: Optional additional element to display next to the name.
// - wideCollapse: Optional, lets the entire header open the collapsible section
// - subtext: Optional, adds smaller subtext
// - persistentChildren: bool, if false or undefined children will unrender when collapsed
// - asterisk: bool, if true adds an asterisk to the name
export default function Collapsible({ className, name, imgsrc, children, startOpen, tag, wideCollapse, subtext, persistentChildren, asterisk, externalOpen, externalSetOpen }) {
	// Default startOpen to true if not provided
	startOpen = startOpen !== undefined ? startOpen : true;
	persistentChildren = persistentChildren ?? false;

	// State to track whether the collapsible is open or closed
	const [open, setOpen] = useState(startOpen);

	// Function to toggle the open state
	const toggleOpen = () => {
		if(externalOpen !== undefined){
			externalSetOpen(prev => !prev);
		}else{
			setOpen(!open);
		}
	};

	const currentlyOpen = externalOpen !== undefined ? externalOpen : open; 

	// Style for the toggle icon (rotates when open)
	const imgStyle = {
		transform: open ? 'rotate(180deg)' : '', // Rotate 180 degrees when open
		transition: 'transform 50ms ease', // Smooth transition for rotation
		cursor: 'pointer' // Pointer cursor to indicate clickability
	};

	return (
		<div className={className}>
			{/* Header section with name, optional tag, and toggle icon */}
			<div 
				style={{ display: 'flex', cursor: wideCollapse ? 'pointer' : 'default' }} 
				onClick={() => wideCollapse ? toggleOpen() : 'nop'}
			>
				<span className={className + '-name hbox'}>
					<span>{name}{(asterisk ?? false) && '*' }</span>
					{!!subtext && <span>{subtext}</span>}
				</span>
				{tag !== undefined && tag} {/* Render tag if provided */}
				<span style={{ flex: 1 }} /> {/* Spacer to push the icon to the right */}
				<img
					className={name.toLowerCase() + '-img'} // Dynamic class name based on the name prop
					src={imgsrc ? imgsrc : '/images/chevron.webp'} // Use provided imgsrc or default chevron image
					style={imgStyle}
					onClick={toggleOpen} // Toggle open state on click
					alt='collapse section' // Alt text for accessibility
				/>
			</div>
			{/* Render children only if the collapsible is open */}
			{persistentChildren 
				? <div style={currentlyOpen ? {} : {display: 'none'}}>{children}</div>
				: currentlyOpen && <div>{children}</div>
			}
		</div>
	);
}
