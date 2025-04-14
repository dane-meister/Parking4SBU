import React, { useState } from 'react';

// Collapsible component: A reusable component that can toggle the visibility of its children.
// Props:
// - className: CSS class for the outermost div.
// - name: Name or title displayed in the collapsible header.
// - imgsrc: Source URL for the toggle icon (defaults to a chevron image).
// - children: Content to display inside the collapsible section.
// - startOpen: Boolean to determine if the collapsible starts open (default: true).
// - tag: Optional additional element to display next to the name.
// - wideCollapse: Optional, lets the entire header open the collapsible section
export default function Collapsible({ className, name, imgsrc, children, startOpen, tag, wideCollapse }) {
	// Default startOpen to true if not provided
	startOpen = startOpen !== undefined ? startOpen : true;

	// State to track whether the collapsible is open or closed
	const [open, setOpen] = useState(startOpen);

	// Function to toggle the open state
	const toggleOpen = () => {
		setOpen(!open);
	};

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
				<span className={className + '-name'}>{name}</span>
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
			{open && <div>{children}</div>}
		</div>
	);
}
