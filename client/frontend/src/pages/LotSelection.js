import React, { useState, useRef, useEffect } from 'react'
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
  const [ rateType, setRateType ] = useState('hourly');
  const [ buildingLotType, setBuildingLotType ] = useState('building');
  
  const [ showFilter, setShowFilter ] = useState(false);
  const [ filterUncovered, setFilterUncovered ] = useState(true);
  const [ filterCovered, setFilterCovered ] = useState(true);
  const [ filterEVCharging, setFilterEVCharging ] = useState(false);
  const [ filterDisability, setFilterDisability ] = useState(true);

  const [ resultType, setResultType ] = useState('Relevance');
  
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
      <div className='hbox'>
        <input id='building-lot-search'
          placeholder={`Search for a ${buildingLotType}`}
        />
        <Filter 
          showFilter={showFilter} 
          setShowFilter={setShowFilter}
          filters={[
            filterCovered, setFilterCovered,
            filterUncovered, setFilterUncovered,
            filterEVCharging, setFilterEVCharging,
            filterDisability, setFilterDisability
          ]}
        />
      </div>
      </section>
      
      <hr/>  
      <section>
        <header id='results-header' className='hbox'>
          Results
          <span className='flex'/>
          sort by
        </header>
      </section>
    </section>
  )
}

function Filter({ showFilter, setShowFilter, filters}) {
  const [showFullLots, setShowFullLots] = useState(false);
  const [onlyShowEVChargerAvailable, setOnlyShowEVChargerAvailable] = useState(false);
  const [showCoveredLots, setShowCoveredLots] = useState(true);
  const [showUncoveredLots, setShowUncoveredLots] = useState(true);
  const [
    filterCovered, setFilterCovered,
    filterUncovered, setFilterUncovered,
    filterEVCharging, setFilterEVCharging,
    filterDisability, setFilterDisability
  ] = filters;

  const handleShowFullLotsChange = (event) => {
    setShowFullLots(event.target.checked);
  };
  const handleShowCoveredLotsChange = (event) => {
    setShowFullLots(event.target.checked);
  };

  const anyFilterEnabled = filterCovered || filterUncovered || filterEVCharging || filterDisability;

  // Clear all checkboxes
  const handleClearAll = () => {
    setFilterCovered(false);
    setFilterUncovered(false);
    setFilterEVCharging(false);
    setFilterDisability(false);
  };

  return (
    <>
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

      {showFilter && (
        <Popup 
          close={() => setShowFilter(false)}
          onClearAll={handleClearAll}  
          anyFilterEnabled={anyFilterEnabled}
        >
          {/* Checkboxes inside the popup body */}
          <div className='filter-row hbox'>
            <label>
              <input 
                className='filter-check' 
                type='checkbox'
                checked={filterUncovered}
                onChange={() => setFilterUncovered(!filterUncovered)}
              />
              Lot — Uncovered
            </label>
          </div>

          <div className='filter-row hbox'>
            <label>
              <input 
                className='filter-check' 
                type='checkbox'
                checked={filterCovered}
                onChange={() => setFilterCovered(!filterCovered)}
              />
              Lot — Covered
            </label>
          </div>

          <div className='filter-row hbox'>
            <label>
              <input 
                className='filter-check' 
                type='checkbox'
                checked={filterEVCharging}
                onChange={() => setFilterEVCharging(!filterEVCharging)}
              />
              EV Charging
            </label>
          </div>

          <div className='filter-row hbox'>
            <label>
              <input 
                className='filter-check' 
                type='checkbox'
                checked={filterDisability}
                onChange={() => setFilterDisability(!filterDisability)}
              />
              Disability Accessible
            </label>
          </div>
        </Popup>
      )}
    </>
  );
}
