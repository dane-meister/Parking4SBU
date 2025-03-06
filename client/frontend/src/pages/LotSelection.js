import React from 'react'
import '../stylesheets/LotSelection.css'
import '../stylesheets/index.css'

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
    <section className='sidebar'>
      <div className="hbox selection" id="rate-selection">
        <span class="selected hover">Hourly</span>
        <span>/</span>
        <span className='hover-black'>Daily</span>
        <span>/</span>
        <span className='hover-black'>Monthly</span>
        <span>/</span>
        <span className='hover-black'>Semester</span>
        <span>/</span>
        <span className='hover-black'>Yearly</span>
      </div>

      <hr/>

      <section className='margin-wrapper' style={{margin: "0px 15px"}}>
      <div className='hbox selection' id='building-lot-selection'>
        <span className='selected hover-black'>Building</span>
        <span>/</span>
        <span className='hover-black'>Lot</span>
      </div>
      <input id='building-lot-search'/>
      </section>
    </section>
  )
}