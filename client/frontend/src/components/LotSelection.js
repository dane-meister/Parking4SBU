import React from 'react'
import '../stylesheets/LotSelection.css'

const LotSelection = () => {
  return (
    <div className="main-container">
        {/* Left: Map container */}
        <div className="map-container">
          <p>Map will go here</p>
        </div>

        {/* Right: Results & selections container */}
        <div className="results-container">
          <p>Results & selections will go here</p>
        </div>
    </div>
  )
}

export default LotSelection