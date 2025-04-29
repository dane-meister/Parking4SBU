import '../stylesheets/LotResult.css'
import { formatTimeRange } from '../utils/formatTime';

export default function LotResult({ lotObj, setSelectedLot, distance, rateType }) {
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
    location,
    lotImgSrc
  } = lotObj;

  const rates = lotObj?.Rates ?? []; // Get the rates from the lot object or default to an empty array
  
  // Find a rate with desired rate ype (hourly, daily)
  const desiredRateObj = rates.find(rate => typeof rate[rateType] === 'number' && rate[rateType] > 0);

  // Check for a free lot (hourly or daily is explicitly 0)
  const freeRateObj = rates.find(rate =>
    (rate.hourly === 0 || rate.daily === 0)
  );

  // Determine what to display for rate
  let displayRate = '';
  let timeRange = '';
  if (desiredRateObj) {
    displayRate = `$${desiredRateObj[rateType].toFixed(2)} / ${rateType}`;
    timeRange = formatTimeRange(desiredRateObj.lot_start_time, desiredRateObj.lot_end_time);
  } else if (freeRateObj) {
    displayRate = 'Free visitor parking';
    timeRange = formatTimeRange(freeRateObj.lot_start_time, freeRateObj.lot_end_time);
  }
  

  const availableCapacity = 
    ada_availability +
    commuter_core_availability +
    commuter_perimeter_availability +
    commuter_satellite_availability +
    ev_charging_availability +
    faculty_availability +
    metered_availability +
    resident_availability;

    function getRelevantRate(rates, rateType) {
      for (let rate of rates) {
        const value = rate[rateTypeMap[rateType]];
        if (value !== null && value !== undefined) return value;
      }
      return null;
    }
    
    function formatRate(rate, type) {
      if (rate === 0) return "Free";
      if (!rate) return "N/A";
      return `$${rate.toFixed(2)} ${type}`;
    }
    
    const rateTypeMap = {
      hourly: 'hourly',
      daily: 'daily',
      monthly: 'monthly',
      semesterly: 'semesterly_fall_spring',
      yearly: 'yearly'
    };    
    
    const formatDistance = (distance) => {
      const MILE_FOOT_THRESHOLD = 0.15;
      return (distance < MILE_FOOT_THRESHOLD)
        ? `${Math.round((distance * 5280) / 5) * 5} ft` // to feet (nearest 5ft)
        : `${distance.toFixed(3)} mi`; // remain in miles
    }

    const hourlyMap = lotObj.availability || {};
    const hourlyTotals = Object.values(hourlyMap)
      .map(hour => hour?.total)
      .filter(n => typeof n === 'number'); // Filters out undefined or null

    const minAvailable = hourlyTotals.length ? Math.min(...hourlyTotals) : null;


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
          <div className="result-dist-row">{distance ? formatDistance(distance) : ''}</div> {/* Display distance if available */}
          <div className="result-price-time-row">
            <span className='result-price'>{displayRate}</span>
            <span className="result-time">{timeRange}</span>
          </div>
          <div className="result-available-row">
            {minAvailable != null
              ? `${minAvailable} spots available`
              : 'unknown capacity'}
          </div>
        </div>
        <div className="flex"/> {/* Spacer for layout adjustment */}
        
        {/* Right section containing additional lot details */}
        <div className="lot-result-info vbox">
          <div className="result-dummy-row flex"/> {/* Placeholder rows for alignment */}
          <div className="result-dummy-row flex" style={{color: 'white'}}>uncovered</div>
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