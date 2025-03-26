import '../stylesheets/LotResult.css'

export default function LotResult({ lotObj, setSelectedLot, distance }){
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

  const availableCapacity = 0;

  return (<section className="lot-result hbox" onClick={() => setSelectedLot(lotObj)}>
    {/* <img 
      className='result-img' 
      src={lotImgSrc ?? '/images/lots/placeholder_lot.png'}
      style={lotImgSrc ? {height: '120px'} : {margin: '0px 25px 0px 10px'}}
      alt='lot'
    /> */}
    
    <section className="lot-result-info-container hbox wide tall">
      <div className='lot-result-info vbox'>
        <div className='result-name-row'>{name ?? 'Unknown Lot'}</div>
        <div className="result-dist-row">{!!distance ? `${distance.toFixed(3)} mi` : ''}</div>
        <div className="result-price-time-row">
          <span className='result-price'>{rate ?? 'unknown rate'}</span>
          <span className="result-time">{time ?? ''}</span>
        </div>
        <div className="result-available-row">{!!availableCapacity ? `${availableCapacity} spots available` : 'unknown capacity'}</div>
      </div>
      <div className="flex"/>
      <div className="lot-result-info vbox">
        <div className="result-dummy-row flex"/>
        <div className="result-dummy-row flex"/>
        <div className="result-covered-row">{covered ? 'covered' : 'uncovered'}</div>
        <div className="result-icon-row">
          {(ada_availability > 0) && <img src='/images/disability_icon.png' alt='has disability parking icon'/>}
          {(ev_charging_availability > 0) && <img src='/images/ev_icon.png' alt='has ev charger icon'/>}
        </div>
      </div>
    </section>
  </section>);
}