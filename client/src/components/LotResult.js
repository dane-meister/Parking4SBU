import '../stylesheets/LotResult.css'

export default function LotResult(props){
  const {
    lot_name,
    distance,
    rate,
    time,
    available_capacity,
    is_covered,
    has_disability,
    has_ev_charger,
    lot_img_src
  } = props;

  return (<section className="lot-result hbox" >
    <img 
      className='result-img' 
      src={lot_img_src ?? '/images/lots/placeholder_lot.png'}
      style={lot_img_src ? {height: '120px'} : {margin: '0px 25px 0px 10px'}}
    />
    
    <section className="lot-result-info-container hbox wide tall">
      <div className='lot-result-info vbox'>
        <div className='result-name-row'>{lot_name ?? 'Unknown Lot'}</div>
        <div className="result-dist-row">{distance ?? 'unknown distance'}</div>
        <div className="result-price-time-row">
          <span className='result-price'>{rate ?? 'Free'}</span>
          <span className="result-time">{time ?? ''}</span>
        </div>
        <div className="result-available-row">{available_capacity ?? 'unknown capacity'}</div>
      </div>
      <div className="flex"/>
      <div className="lot-result-info vbox">
        <div className="result-dummy-row flex"/>
        <div className="result-dummy-row flex"/>
        <div className="result-covered-row">{!!is_covered ? 'covered' : 'uncovered'}</div>
        <div className="result-icon-row">
          {has_disability && <img src='/images/disability_icon.png'/>}
          {has_ev_charger && <img src='/images/ev_icon.png'/>}
        </div>
      </div>
    </section>
  </section>);
}