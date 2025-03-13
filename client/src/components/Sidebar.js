import { useState } from 'react';
import { Filter, LotResult, InformationSystems, Search } from '.'

function Sidebar({ selectedLot, setSelectedLot }) {
  const [ rateType, setRateType ] = useState('hourly');
  const [ buildingLotType, setBuildingLotType ] = useState('building');
  
  const [ showFilter, setShowFilter ] = useState(false);
  const [ filterUncovered, setFilterUncovered ] = useState(true);
  const [ filterCovered, setFilterCovered ] = useState(true);
  const [ filterEVCharging, setFilterEVCharging ] = useState(false);
  const [ filterDisability, setFilterDisability ] = useState(true);

  const [ resultType, setResultType ] = useState('Relevance');
  const [value, setValue] = useState('');
  return (
    <section className='sidebar'>
      <div className='hbox'>
      {selectedLot && 
        <div className='arrow-wrapper'>
          <img src='/images/arrow.png' alt='back' className='back-arrow' onClick={()=>setSelectedLot(null)}/>
        </div>
      }
      <div className="hbox selection" id="rate-selection" style={selectedLot ? {marginRight:'35px'} : {}}>
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
      { selectedLot 
        ? <InformationSystems 
            lotObj={{
              lotName: 'Lot 40',
              distance: '40ft',
              availableCapacity: '50 spots available',
              hasDisability: false,
              lotImgSrc: 'images/lots/lot_40.png'
            }}
          />
        : (<>
    
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
            {/* <input id='building-lot-search' */}
            {/*   placeholder={`Search for a ${buildingLotType}`} */}
            {/* /> */}
            <Search 
              searchType={buildingLotType}
              value={value}
              setValue={setValue}
            />
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

          <section className='results'>
            <header id='results-header' className='hbox'>
              Results
              <span className='flex' key={1}/>
              sort by
            </header>
            <section className='lot-results'>
              <LotResult
                lotName='Lot 40'
                distance='40ft'
                availableCapacity='50 spots available'
                hasDisability={true}
                lotImgSrc='images/lots/lot_40.png'
                setSelectedLot={() => setSelectedLot('Lot 40')}
              />
              {Array.from({length: 10}, (_, n) => n).map(elem => {
                return <LotResult key={elem}/>
              })}
            </section>
          </section>
        </>)
      }
    </section>
  )
}

export default Sidebar;