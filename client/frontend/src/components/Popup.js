import React from 'react'
import '../stylesheets/Popup.css'

export default function Popup({ children, close, onClearAll, anyFilterEnabled }) {

  return (
    <div className="popup-overlay" onClick={close}>
      <div 
        className="popup"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
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

        <div className="popup-body">
          {children}
        </div>

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
