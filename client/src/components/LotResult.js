import '../stylesheets/LotResult.css'

export default function LotResult({ lotObj, setSelectedLot, distance }) {
  // Destructure the lotObj to extract all relevant properties
  const {
    ada_availability,
    ada_capacity,
    capacity,
    commuter_core_availability,
    commuter_core_capacity,
    commuter_perimeter_availability,
    commuter_perimeter_capacity,
    commuter_satellite_availability,
    commuter_satellite_capacity,
    covered,
    ev_charging_availability,
    ev_charging_capacity,
    faculty_availability,
    faculty_capacity,
    id,
    metered_availability,
    metered_capacity,
    name,
    resident_availability,
    resident_capacity,
    resident_zone,
    rate,
    time,
    lotImgSrc
  } = lotObj;

  const availableCapacity = 
    ada_availability +
    commuter_core_availability +
    commuter_perimeter_availability +
    commuter_satellite_availability +
    ev_charging_availability +
    faculty_availability +
    metered_availability +
    resident_availability;

  return (
    <section 
      className="lot-result hbox" 
      onClick={() => setSelectedLot(lotObj)} // Set the selected lot when the section is clicked
    >
      {/* Uncomment the following block to display the lot image */}
      {/* <img 
        className='result-img' 
        src={lotImgSrc ?? '/images/lots/placeholder_lot.png'} // Use placeholder image if lotImgSrc is not provided
        style={lotImgSrc ? {height: '120px'} : {margin: '0px 25px 0px 10px'}} // Adjust styling based on image availability
        alt='lot'
      /> */}
      
      <section className="lot-result-info-container hbox wide tall">
        {/* Left section containing lot details */}
        <div className='lot-result-info vbox'>
          <div className='result-name-row'>{name ?? 'Unknown Lot'}</div> {/* Display lot name or fallback to 'Unknown Lot' */}
          <div className="result-dist-row">{distance ? `${distance.toFixed(3)} mi` : ''}</div> {/* Display distance if available */}
          <div className="result-price-time-row">
            <span className='result-price'>{rate ?? 'unknown rate'}</span> {/* Display rate or fallback */}
            <span className="result-time">{time ?? ''}</span> {/* Display time if available */}
          </div>
          <div className="result-available-row">
            {availableCapacity ? `${availableCapacity} spots available` : 'unknown capacity'} {/* Display available capacity or fallback */}
          </div>
        </div>
        <div className="flex"/> {/* Spacer for layout adjustment */}
        
        {/* Right section containing additional lot details */}
        <div className="lot-result-info vbox">
          <div className="result-dummy-row flex"/> {/* Placeholder rows for alignment */}
          <div className="result-dummy-row flex"/>
          <div className="result-covered-row">{covered ? 'covered' : 'uncovered'}</div> {/* Display whether the lot is covered */}
          <div className="result-icon-row">
            {/* Display icons for ADA and EV charging availability */}
            {(ada_availability > 0) && <img src='/images/disability_icon.png' alt='has disability parking icon'/>}
            {(ev_charging_availability > 0) && <img src='/images/ev_icon.png' alt='has ev charger icon'/>}
          </div>
        </div>
      </section>
    </section>
  );
}