import { useState, useEffect } from 'react';
import { Filter, LotResult, LotDetails, Search } from '.'

function Sidebar({ selectedLot, setSelectedLot, buildings, parkingLots }) {
  // State for rate type selection (hourly, daily, etc.)
  const [ rateType, setRateType ] = useState('hourly');
  
  // State for toggling between building and lot selection
  const [ buildingLotType, setBuildingLotType ] = useState('building');
  
  // State for the currently selected building
  const [ selectedBuilding, setSelectedBuilding ] = useState(null);

  // States for filter visibility and individual filter options
  const [ showFilter, setShowFilter ] = useState(false);
  const [ filterUncovered, setFilterUncovered ] = useState(false);
  const [ filterCovered, setFilterCovered ] = useState(false);
  const [ filterEVCharging, setFilterEVCharging ] = useState(false);
  const [ filterDisability, setFilterDisability ] = useState(false);

// Temporary UI state for checkboxes in Filter popup
  const [tempFilterCovered, setTempFilterCovered] = useState(filterCovered);
  const [tempFilterUncovered, setTempFilterUncovered] = useState(filterUncovered);
  const [tempFilterEVCharging, setTempFilterEVCharging] = useState(filterEVCharging);
  const [tempFilterDisability, setTempFilterDisability] = useState(filterDisability);

  // State for result sorting type
  const [ resultType, setResultType ] = useState('Relevance');
  
  // State for search input value
  const [ value, setValue ] = useState('');

  // State for the list of parking lot results
  const [ lotResults, setLotResults ] = useState(parkingLots);

  // State for the base list of parking lots (original data)
  const [ baseLots, setBaseLots ] = useState(parkingLots);

  // Apply filters for parking lot results
  function applyFilters(lots) {
    return lots.filter(lot => {
      const matchesCovered = lot.covered;
      const matchesUncovered = !lot.covered;
  
      const passesCoverFilter = filterCovered || filterUncovered
        ? (filterCovered && matchesCovered) || (filterUncovered && matchesUncovered)
        : true;
  
      const matchesEV = filterEVCharging ? (lot.ev_charging_availability ?? 0) > 0 : true;
      const matchesDisability = filterDisability ? (lot.ada_availability ?? 0) > 0 : true;
  
      return passesCoverFilter && matchesEV && matchesDisability;
    });
  }
  
  useEffect(() => {
    const filtered = applyFilters(baseLots);
    setLotResults(filtered);
  }, [
    filterCovered, 
    filterUncovered, 
    filterEVCharging, 
    filterDisability, 
    baseLots
  ]);  

  return (
    <section className='sidebar'>
      <div className='hbox'>
        {/* Back arrow to deselect a lot */}
        {selectedLot && 
          <div className='arrow-wrapper'>
            <img 
              src='/images/arrow.png' 
              alt='back' 
              className='back-arrow' 
              onClick={() => setSelectedLot(null)}
            />
          </div>
        }

        {/* Rate type selection (hourly, daily, etc.) */}
        <div 
          className="hbox selection" 
          id="rate-selection" 
          style={selectedLot ? {marginRight:'35px'} : {}}
        >
          <span 
            className={'type-hover '+(rateType==='hourly' ? 'selected' : '')}
            onClick={() => setRateType('hourly')}
          >Hourly</span>
          <span>/</span>
          <span 
            className={'type-hover '+(rateType==='daily' ? 'selected' : '')} 
            onClick={() => setRateType('daily')}
          >Daily</span>
        </div>
      </div>

      <hr style={{margin: "0px 15px"}}/>

      {/* Display detailed information if a lot is selected */}
      { selectedLot 
        ? <LotDetails 
            lotObj={selectedLot}
            rateType={rateType}
          />
        : (<>
          {/* Toggle between building and lot search */}
          <div className='hbox selection' id='building-lot-selection'>
            <span 
              className={'type-hover '+((buildingLotType==='building') ? 'selected' : '')}
              onClick={() => setBuildingLotType('building')}   
            >Building</span>
            <span>/</span>
            <span 
              className={'type-hover '+((buildingLotType==='lot') ? 'selected' : '')}
              onClick={() => setBuildingLotType('lot')}
            >Lot</span>
          </div>

          <div className='hbox'>
            {/* Search component for buildings or lots */}
            <Search 
              searchType={buildingLotType}
              buildings={buildings}
              parkingLots={parkingLots}
              value={value}
              setValue={setValue}
              setSelectedBuilding={setSelectedBuilding} 
              setLotResults={setLotResults}
              setBaseLots={setBaseLots}
              setSelectedLot={setSelectedLot}
            />
            {/* Filter component for additional filtering options */}
            <Filter 
              showFilter={showFilter} 
              setShowFilter={setShowFilter}
              filters={[
                tempFilterCovered, setTempFilterCovered,
                tempFilterUncovered, setTempFilterUncovered,
                tempFilterEVCharging, setTempFilterEVCharging,
                tempFilterDisability, setTempFilterDisability
              ]}
              onApply={() => {
                setFilterCovered(tempFilterCovered);
                setFilterUncovered(tempFilterUncovered);
                setFilterEVCharging(tempFilterEVCharging);
                setFilterDisability(tempFilterDisability);
                setShowFilter(false);
              }}
            />
          </div>
          
          <hr/>  

          {/* Display search results */}
          <section className='results'>
            <header id='results-header' className='hbox'>
              Results
              <span className='flex' key={1}/>
              sort by
            </header>
            <section className='lot-results'>
              {lotResults.map((lot,idx) => {
                return <LotResult 
                  lotObj={lot}
                  key={idx}
                  setSelectedLot={setSelectedLot}
                  distance={selectedBuilding ? lot.distance_miles : ''}
                  rateType={rateType}
                />
              })}
            </section>
          </section>
        </>)
      }
    </section>
  )
}

export default Sidebar;