import '../stylesheets/LotResult.css'

export default function LotResult(){
  return (<section className="lot-result hbox" >
    <img 
      className='result-img' 
      src='/images/lots/placeholder_lot.png'
    />
    
    <section className="lot-result-info-container hbox wide tall">
      <div className='lot-result-info vbox'>
        <div className='result-name-row'>Lot 19</div>
        <div className="result-dist-row">500 ft</div>
        <div className="result-price-time-row">
          <span className='result-price'>$2.25 / hr</span>
          <span className="result-time">6am-4pm</span>
        </div>
        <div className="result-available-row">20 spots available</div>
      </div>
      <div className="flex"/>
      <div className="lot-result-info vbox">
        <div className="result-dummy-row flex"/>
        <div className="result-dummy-row flex"/>
        <div className="result-covered-row">uncovered</div>
        <div className="result-icon-row">
          <img src='/images/disability_icon.png'/>
          <img src='/images/ev_icon.png'/>
        </div>
      </div>
    </section>
  </section>);
}