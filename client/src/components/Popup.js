import React from 'react'
import '../stylesheets/Popup.css'

// Popup component to display a modal with filters and actions
export default function Popup({ children, close, onClearAll, anyFilterEnabled }) {

  return (
    // Overlay that covers the screen and closes the popup when clicked
    <div className="popup-overlay" onClick={close}>
      <div 
        className="popup"
        onClick={(e) => e.stopPropagation()} // Prevent closing the popup when clicking inside it
      >
        {/* Header section with a title and a close button */}
        <div className="popup-header">
          <h2>Filters</h2>
          <button className="close-button" onClick={close}>
            <img 
              src="/images/x.png" 
              alt="Close" 
              className="close-icon"
            />
          </button>
        </div>

        {/* Body section to render the children passed to the Popup */}
        <div className="popup-body">
          {children}
        </div>

        {/* Footer section with action buttons */}
        <div className="popup-footer">
          <button className="primary-button" onClick={close}>
            Show Results
          </button>
          {anyFilterEnabled && (
            <button className="clear-button" onClick={onClearAll}>
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
