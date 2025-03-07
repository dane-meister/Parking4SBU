import React, { useState } from 'react'
import '../stylesheets/LotSelection.css'
import '../stylesheets/index.css'
import Collapsible from '../components/Collapsible'
import Popup from '../components/Popup.js'


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
  const [rateType, setRateType] = useState('hourly');
  const [buildingLotType, setBuildingLotType] = useState('building');
  const [showFilter, setShowFilter] = useState(false);

  return (
    <section className='sidebar'>
      <div className="hbox selection" id="rate-selection">
        <span 
          className={'hover-black '+(rateType==='hourly' ? 'selected' : '')}
          onClick={() => setRateType('hourly')}
        >Hourly</span>
        <span>/</span>
        <span 
          className={'hover-black '+(rateType==='daily' ? 'selected' : '')}
          onClick={() => setRateType('daily')}
        >Daily</span>
        <span>/</span>
        <span 
          className={'hover-black '+(rateType==='monthly' ? 'selected' : '')}
          onClick={() => setRateType('monthly')}
        >Monthly</span>
        <span>/</span>
        <span 
          className={'hover-black '+(rateType==='semesterly' ? 'selected' : '')}
          onClick={() => setRateType('semesterly')}
        >Semesterly</span>
        <span>/</span>
        <span 
          className={'hover-black '+(rateType==='yearly' ? 'selected' : '')}
          onClick={() => setRateType('yearly')}
        >Yearly</span>
      </div>

      <hr style={{margin: "0px 15px"}}/>

      <section className='margin-wrapper' style={{margin: "0px 15px"}}>
      <div className='hbox selection' id='building-lot-selection'>
        <span 
          className={'hover-black '+((buildingLotType==='building') && 'selected')}
          onClick={() => setBuildingLotType('building')}   
        >Building</span>
        <span>/</span>
        <span 
          className={'hover-black '+((buildingLotType==='lot') && 'selected')}
          onClick={() => setBuildingLotType('lot')}
        >Lot</span>
      </div>
      <input id='building-lot-search'/>
      
      </section>
      <div className='hbox' style={{margin: "3px 15px 0px 15px"}}>
        <span className='flex'/>
        <Filter showFilter={showFilter} setShowFilter={setShowFilter}/>
      </div>
      
      <hr/>  
    </section>
  )
}

function Filter({ showFilter, setShowFilter }) {
  const [showFullLots, setShowFullLots] = useState(false);
  const [onlyShowEVChargerAvailable, setOnlyShowEVChargerAvailable] = useState(false);
  const [showCoveredLots, setShowCoveredLots] = useState(true);
  const [showUncoveredLots, setShowUncoveredLots] = useState(true);
  
  const handleShowFullLotsChange = (event) => {
    setShowFullLots(event.target.checked);
  };
  const handleShowCoveredLotsChange = (event) => {
    setShowFullLots(event.target.checked);
  };

  return (<>
    <button 
      className='filter-btn'
      onClick={() => setShowFilter(true)}
    >
      <img 
        src='/images/filter.png' 
        alt='filter icon' 
        style={{height: '16px', marginRight: '10px'}}
      />
      Filter
    </button>
    {showFilter && <Popup close={() => setShowFilter(false)}/>}
  </>);
}