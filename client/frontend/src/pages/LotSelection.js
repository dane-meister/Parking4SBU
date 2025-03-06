import React from 'react'
import '../stylesheets/LotSelection.css'

const LotSelection = () => {
  return (
    <div className="main-container">
        {/* Left: Map container */}
        <div className="map-container">
          <Map />
        </div>

        {/* Right: Results & selections container */}
        <div className="results-container">
          <Sidebar />
        </div>
    </div>
  )
}

export default LotSelection

function Map() {
  return (
    <div>Map</div>
  )
}

function Sidebar() {
  return (
    <div>Sidebar</div>
  )
}