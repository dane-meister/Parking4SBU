import { useState } from 'react';
import { Popup } from '.';

// Filter component to manage and display filtering options
function Filter({ showFilter, setShowFilter, filters, onApply }) {
  // Local state for additional filter options
  const [showFullLots, setShowFullLots] = useState(false);
  const [onlyShowEVChargerAvailable, setOnlyShowEVChargerAvailable] = useState(false);
  const [showCoveredLots, setShowCoveredLots] = useState(true);
  const [showUncoveredLots, setShowUncoveredLots] = useState(true);

  // Destructure filter states passed as props
  const [
    filterCovered, setFilterCovered,
    filterUncovered, setFilterUncovered,
    filterEVCharging, setFilterEVCharging,
    filterDisability, setFilterDisability
  ] = filters;

  // Handler for toggling the "Show Full Lots" checkbox
  const handleShowFullLotsChange = (event) => {
    setShowFullLots(event.target.checked);
  };

  // Handler for toggling the "Show Covered Lots" checkbox
  const handleShowCoveredLotsChange = (event) => {
    setShowCoveredLots(event.target.checked);
  };

  // Determine if any filter is currently enabled
  const anyFilterEnabled = filterCovered || filterUncovered || filterEVCharging || filterDisability;

  // Clear all filter checkboxes
  const handleClearAll = () => {
    setFilterCovered(false);
    setFilterUncovered(false);
    setFilterEVCharging(false);
    setFilterDisability(false);
  };

  return (
    <>
      {/* Button to open the filter popup */}
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

      {/* Popup for filter options */}
      {showFilter && (
        <Popup 
          close={() => setShowFilter(false)} // Close the popup
          onClearAll={handleClearAll}       // Clear all filters
          anyFilterEnabled={anyFilterEnabled} // Indicate if any filter is active
          onApply={onApply} // Function to apply filters
        >
          {/* Checkboxes for each filter option */}
          <div className='filter-row hbox'>
            <label>
              <input 
                className='filter-check' 
                type='checkbox'
                checked={filterUncovered}
                onChange={() => setFilterUncovered(!filterUncovered)} // Toggle uncovered lots filter
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
                onChange={() => setFilterCovered(!filterCovered)} // Toggle covered lots filter
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
                onChange={() => setFilterEVCharging(!filterEVCharging)} // Toggle EV charging filter
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
                onChange={() => setFilterDisability(!filterDisability)} // Toggle disability accessibility filter
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