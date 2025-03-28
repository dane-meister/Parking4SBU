import { useState } from 'react';
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
  const [ filterUncovered, setFilterUncovered ] = useState(true);
  const [ filterCovered, setFilterCovered ] = useState(true);
  const [ filterEVCharging, setFilterEVCharging ] = useState(false);
  const [ filterDisability, setFilterDisability ] = useState(true);

  // State for result sorting type
  const [ resultType, setResultType ] = useState('Relevance');
  
  // State for search input value
  const [ value, setValue ] = useState('');

  // State for the list of parking lot results
  const [ lotResults, setLotResults ] = useState(parkingLots);

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
          <span>/</span>
          <span 
            className={'type-hover '+(rateType==='monthly' ? 'selected' : '')}
            onClick={() => setRateType('monthly')}
          >Monthly</span>
          <span>/</span>
          <span 
            className={'type-hover '+(rateType==='semesterly' ? 'selected' : '')}
            onClick={() => setRateType('semesterly')}
          >Semesterly</span>
          <span>/</span>
          <span 
            className={'type-hover '+(rateType==='yearly' ? 'selected' : '')}
            onClick={() => setRateType('yearly')}
          >Yearly</span>
        </div>
      </div>

      <hr style={{margin: "0px 15px"}}/>

      {/* Display detailed information if a lot is selected */}
      { selectedLot 
        ? <LotDetails 
            lotObj={selectedLot}
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
              setSelectedLot={setSelectedLot}
            />
            {/* Filter component for additional filtering options */}
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
          
          <hr/>  

          {/* Display search results */}
          <section className='results'>
            <header id='results-header' className='hbox'>
              Results
              <span className='flex' key={1}/>
              sort by
            </header>
            <section className='lot-results'>
              {lotResults.map(lot => {
                return <LotResult 
                  lotObj={lot}
                  setSelectedLot={setSelectedLot}
                  distance={selectedBuilding ? lot.distance_miles : '' }
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