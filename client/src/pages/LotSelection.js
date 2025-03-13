import React, { useState, useRef, useEffect } from 'react'
import '../stylesheets/LotSelection.css'
import '../stylesheets/index.css'
// import Collapsible from '../components/Collapsible'
// import Popup from '../components/Popup.js'
// import Map from '../components/Map.js'
// import LotResult from '../components/LotResult.js'

import { Sidebar, Map } from '../components'


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

export default LotSelection;