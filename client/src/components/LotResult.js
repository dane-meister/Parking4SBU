import '../stylesheets/LotResult.css'

export default function LotResult(props){
  const {
    lotName,
    distance,
    rate,
    time,
    availableCapacity,
    isCovered,
    hasDisability,
    hasEvCharger,
    lotImgSrc,
    setSelectedLot,
  } = props;

  return (<section className="lot-result hbox" onClick={setSelectedLot}>
    <img 
      className='result-img' 
      src={lotImgSrc ?? '/images/lots/placeholder_lot.png'}
      style={lotImgSrc ? {height: '120px'} : {margin: '0px 25px 0px 10px'}}
      alt='lot'
    />
    
    <section className="lot-result-info-container hbox wide tall">
      <div className='lot-result-info vbox'>
        <div className='result-name-row'>{lotName ?? 'Unknown Lot'}</div>
        <div className="result-dist-row">{distance ?? 'unknown distance'}</div>
        <div className="result-price-time-row">
          <span className='result-price'>{rate ?? 'Free'}</span>
          <span className="result-time">{time ?? ''}</span>
        </div>
        <div className="result-available-row">{availableCapacity ?? 'unknown capacity'}</div>
      </div>
      <div className="flex"/>
      <div className="lot-result-info vbox">
        <div className="result-dummy-row flex"/>
        <div className="result-dummy-row flex"/>
        <div className="result-covered-row">{!!isCovered ? 'covered' : 'uncovered'}</div>
        <div className="result-icon-row">
          {hasDisability && <img src='/images/disability_icon.png' alt='has disability parking icon'/>}
          {hasEvCharger && <img src='/images/ev_icon.png' alt='has ev charger icon'/>}
        </div>
      </div>
    </section>
  </section>);
}