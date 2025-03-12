export default function LotResult(){
  const image_style ={
    height: '100px',
  }
  const result_style = {
    height: '120px',
    borderTop: 'black solid 1px',
    alignItems: 'center'
  }
  return (<section className="hbox" style={result_style}>
    <img src='/images/placeholder_lot.png' style={image_style}/>
    
    <section className="hbox" style={{width:'100%'}}>
      <div>
        <div className='result-name-row'>Lot 19</div>
        <div className="result-dist-row">500 ft</div>
        <div className="result-price-time-row">
          <span className='result-price'>$2.25 / hr</span>
          <span className="result-time">6am-4pm</span>
        </div>
        <div className="result-available-row">20 spots available</div>
      </div>
      <div className="flex"/>
      <div className="vbox">
        <div className="result-dummy-row flex"/>
        <div className="result-dummy-row flex"/>
        <div className="result-covered-row">uncovered</div>
        <div className="results-icon-row">
          
        </div>
      </div>
    </section>
  </section>);
}