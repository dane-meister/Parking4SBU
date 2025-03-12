import { useState } from 'react';
import { Popup } from '.';

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

export default Filter;