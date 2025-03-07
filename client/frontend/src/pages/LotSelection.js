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
  const [showFilter, setShowFilter] = useState(true);

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
        <span className='selected hover-black'>Building</span>
        <span>/</span>
        <span className='hover-black'>Lot</span>
      </div>
      <input id='building-lot-search'/>
      <Filter />

      </section>

      <hr/>

      {showFilter && <Popup />}
    </section>
  )
}

function Filter() {
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

  return (
    <Collapsible 
        className='filter' 
        name='Filter'
    >
      <div>
        <label className='' style={{display: 'flex', gap: '10px'}}>
          Show Full Lots: 
          <input 
            className='pointer'
            type='checkbox' 
            id='show-full-lots'
            defaultChecked={showFullLots}
            onChange={setShowFullLots}
          />
        </label>
      </div>
      <div className='hbox' style={{gap: '10px'}}>
        <span>
          <label htmlFor='show-covered-lots'>Only Show Uncovered Lots</label>
          <input 
            className='pointer'
            type='checkbox' 
            id='only-show-uncovered-lots' 
            defaultChecked={showUncoveredLots}
            onChange={setShowUncoveredLots}
          />  
        </span>
      </div>
      <label className='' style={{display: 'flex', gap: '10px'}}>
        EV charger available: 
        <input 
          className='pointer'
          type='checkbox' 
          id='show-full-lots'
          defaultChecked={showFullLots}
          onChange={setShowFullLots}
        />
      </label>
    </Collapsible>
  );
}