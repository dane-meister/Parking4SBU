import { useState, useEffect } from 'react';
import { Filter, LotResult, LotDetails, Search } from '.'
import '../stylesheets/Sidebar.css';

function Sidebar({ selectedLot, setSelectedLot, buildings, parkingLots, selectedBuilding, setSelectedBuilding, initialSearchValue, initialSearchType, times, setTimes, initialRateType }) {
  // State for rate type selection (hourly, daily, etc.)
  const [ rateType, setRateType ] = useState(initialRateType || 'hourly');
  
  // State for toggling between building and lot selection
  const [ buildingLotType, setBuildingLotType ] = useState(initialSearchType || 'building');
  
  // State for the currently selected building
  // const [ selectedBuilding, setSelectedBuilding ] = useState(null);

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
  const [ value, setValue ] = useState(initialSearchValue || '');

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

  // sorting useEffect
  const [ availableSortMethods, setAvailableMethods ] = useState(['Alphabetical']);
  const [ sortMethod, setSortMethod ] = useState('Alphabetical');
  const [ resortToggle, setResortToggle ] = useState(false);

  function getSortedLots(lots) {
    switch(sortMethod) {
      case 'Alphabetical':
        return [...lots].toSorted((a, b) => a.name.localeCompare(b.name));
      case 'Distance':
        return [...lots].toSorted((a, b) => a.distance_miles - b.distance_miles);
      case 'Price':
        return [...lots].toSorted((a, b) => {
          const getMinRate = lot =>
            lot.Rates?.reduce((min, rate) => {
              const val = rate?.[rateType];
              return (typeof val === 'number' && val >= 0)
                ? Math.min(min, val)
                : min;
            }, Infinity) ?? Infinity;
  
          return getMinRate(a) - getMinRate(b);
        });
      case 'Capacity':
        return [...lots].toSorted((a, b) => {
          const getAvailable = lot =>
            (lot.ada_availability ?? 0) +
            (lot.commuter_core_availability ?? 0) +
            (lot.commuter_perimeter_availability ?? 0) +
            (lot.commuter_satellite_availability ?? 0) +
            (lot.ev_charging_availability ?? 0) +
            (lot.faculty_availability ?? 0) +
            (lot.metered_availability ?? 0) +
            (lot.general_availability ?? 0) +
            (lot.resident_availability ?? 0);
          return getAvailable(b) - getAvailable(a);
        });
      default:
        return lots;
    }
  }

  useEffect(() => {
    const filtered = applyFilters(baseLots);
    const sorted = getSortedLots(filtered);
    setLotResults(sorted);
  }, [
    baseLots,
    filterCovered,
    filterUncovered,
    filterEVCharging,
    filterDisability,
    sortMethod,
    rateType,
    resortToggle
  ]);

  useEffect(() => {
    if (!!selectedBuilding) {
      setAvailableMethods(['Distance', 'Price', 'Capacity', 'Alphabetical']);
    } else {
      setAvailableMethods(['Alphabetical', 'Capacity', 'Price']);
    }

    if (selectedBuilding && sortMethod !== 'Distance') {
      setSortMethod('Distance');
      setResortToggle(prev => !prev); // Trigger re-sort
    }
  }, [selectedBuilding]);
  

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
              onClick={() => {
                setSelectedLot(null);
                setValue("");
              }}
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
            times={times}
          />
        : <LotList 
            buildingLotType={buildingLotType} setBuildingLotType={setBuildingLotType}
            buildings={buildings}
            parkingLots={parkingLots}
            value={value} setValue={setValue}
            selectedBuilding={selectedBuilding} setSelectedBuilding={setSelectedBuilding} 
            lotResults={lotResults} setLotResults={setLotResults}
            setBaseLots={setBaseLots}
            setSelectedLot={setSelectedLot}
            showFilter={showFilter} setShowFilter={setShowFilter}
            tempFilterCovered={tempFilterCovered} setTempFilterCovered={setTempFilterCovered}
            tempFilterUncovered={tempFilterUncovered} setTempFilterUncovered={setTempFilterUncovered}
            tempFilterEVCharging={tempFilterEVCharging} setTempFilterEVCharging={setTempFilterEVCharging}
            tempFilterDisability={tempFilterDisability} setTempFilterDisability={setTempFilterDisability}
            setFilterCovered={setFilterCovered}
            setFilterUncovered={setFilterUncovered}
            setFilterEVCharging={setFilterEVCharging}
            setFilterDisability={setFilterDisability}
            rateType={rateType}
            times={times}
            availableSortMethods={availableSortMethods} setAvailableMethods={setAvailableMethods}
            sortMethod={sortMethod} setSortMethod={setSortMethod}
            toggleResort={() => setResortToggle(!resortToggle)} 
          />
      }
    </section>
  );
}

// C89 style!
// probaly needs better name than LotList
//  -Only displays infomation needed to search lots and browse the list
function LotList({
  buildingLotType, setBuildingLotType,
  buildings,
  parkingLots,
  value, setValue,
  selectedBuilding, setSelectedBuilding,
  lotResults, setLotResults,
  setBaseLots,
  setSelectedLot,
  showFilter, setShowFilter,
  tempFilterCovered, setTempFilterCovered,
  tempFilterUncovered, setTempFilterUncovered,
  tempFilterEVCharging, setTempFilterEVCharging,
  tempFilterDisability, setTempFilterDisability,
  setFilterCovered,
  setFilterUncovered,
  setFilterEVCharging,
  setFilterDisability,
  rateType,
  times,
  availableSortMethods, setAvailableMethods,
  sortMethod, setSortMethod,
  toggleResort,
}){
  const handleSortSelect = (event) => {
    setSortMethod(event.target.value);
    toggleResort();
  };

  return (<>
    {/* Toggle between building and lot search */}
    <div className='hbox selection' id='building-lot-selection'>
      <span 
        className={'type-hover '+((buildingLotType==='building') ? 'selected' : '')}
        onClick={() => setBuildingLotType('building')}   
      >Building</span>
      <span>/</span>
      <span 
        className={'type-hover '+((buildingLotType==='lot') ? 'selected' : '')}
        onClick={() => {
          setBuildingLotType('lot');
          setSelectedBuilding(null);
        }}
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
        setSort={() => setSortMethod('Distance')}
        times={times}
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
        <span id='sort-by'>
          <label htmlFor="sort-by-select" className="sr-only">Sort by</label>
          <select 
            id="sort-by-select" 
            value={sortMethod} 
            onChange={handleSortSelect}
            className="custom-dropdown"
          >
            {availableSortMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </span>

      </header>
      <section className='lot-results'>
        {lotResults.map((lot,idx) => {
          return <LotResult 
            lotObj={lot}
            key={idx}
            setSelectedLot={setSelectedLot}
            distance={selectedBuilding ? lot.distance_miles : ''}
            rateType={rateType}
            times={times}
          />
        })}
      </section>
    </section>
  </>);
}

export default Sidebar;