import { DisableableInput } from '.'

function EditRate({ rateObj, rateNumber, onChange, setFormData, originalRateObj }){
  const onDisable = (name) => {
    if(rateObj[name] == null){
      setFormData(prev => {
        const newRate = prev.rates[rateNumber];
        newRate[name] = '';

        const newRates = prev.rates
        newRates[rateNumber] = newRate;
        return { ...prev,  newRates};
      }); 
    }else{
      setFormData(prev => {
        prev.rates[rateNumber][name] = null;

        return { ...prev };
      }); 
    }
  };

  const setPermitType = (e) => {
    setFormData(prev => {
      prev.rates[rateNumber].permit_type = e.target.selectedOptions[0].value

      return { ...prev };
    }); 
  }

  const toTitleCase = (str) => {
    return str.replaceAll('-', ' ') // remove dashes
      .replace(             // to title case
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
      )
      .replace(/Zone(\d)/, 'Zone $1'); // add space between Zone and number
  };

  const fromTitleCase = (str) => {
    return str.replaceAll(' ', '-') // inserts dashes
      .replace(             // to lower case
        /\w\S*/g,
        text => text.toLowerCase()
      )
      .replace(/zone (\d)/, 'zone$1'); // remove space between zone and number
  };

  const permitTypes = [
    'faculty', 'faculty-life-sciences-1', 'faculty-life-sciences-2', 'faculty-garage-gated-1', 'faculty-garage-gated-2', 
    'premium', 'resident-zone1', 'resident-zone2', 'resident-zone3', 'resident-zone4', 'resident-zone5', 'resident-zone6',
    'core', 'perimeter', 'satellite', 'visitor'
  ]

  const isModified = (field) => rateObj[field] !== originalRateObj[field];

  return (<>
    {/* 
    - means started
    x means finished

    (-) permit_type: "Faculty"
    () lot_start_time: "07:00:00"
    () lot_end_time: "16:00:00"

    (-) hourly: null
    (-) max_hours: null
    (-) daily: null
    (-) monthly: null
    (-) semesterly_fall_spring: null
    (-) semesterly_summer: null
    (-) yearly: 0
    (-) event_parking_price: null
    (-) sheet_number: null
    (-) sheet_price: null
    */}
    {rateNumber !== 0 && <div name='spacer' style={{height: '15px'}}/>}
    <h2 style={{fontSize: '16px', padding: '5px'}}>{`Rate ${rateNumber+1}`}</h2>
    <div><label htmlFor={`permit-select-${rateNumber}`}>Permit Type</label></div>
    <select 
      id={`permit-select-${rateNumber}`} style={{width: '48%'}} 
      value={fromTitleCase(rateObj.permit_type)}
      onChange={setPermitType}
      className={isModified('permit_type') ? 'field-modified' : ''}
    >
      {permitTypes.map((type, index) => {
        const formatted = toTitleCase(type)
        
        return <option key={index} value={fromTitleCase(type)}>{formatted}</option>
      })}
    </select>
    
    {/* rate times */}

    {/* hourly rate */}
    <div className='hbox'>  
      <div style={{width: '48%'}}>
        <DisableableInput
          value={rateObj['hourly'] ?? ''} 
          inputId={`hourly-rate-${rateNumber}`}
          inputName='hourly'
          disabled={rateObj["hourly"] === null}
          onChange={onChange}
          onDisable={() => onDisable('hourly')}
          isModified={isModified('hourly')}
          label='Hourly Rate'
          isMoney
        />
      </div>

      <span className='flex'/>

      <div style={{width: '48%'}}>
        <DisableableInput
          value={rateObj['max_hours'] ?? ''} 
          inputId={`max-hours-${rateNumber}`}
          inputName='max_hours'
          disabled={rateObj["max_hours"] === null}
          onChange={onChange}
          onDisable={() => onDisable('max_hours')}
          isModified={isModified('max_hours')}
          label='Max Hours'
          isInt
        />
      </div>
    </div>

    {/* daily rate */}
    <div className='hbox'>  
      <div style={{width: '48%'}}>
        <DisableableInput
          value={rateObj['daily'] ?? ''} 
          inputId={`daily-rate-${rateNumber}`}
          inputName='daily'
          disabled={rateObj["daily"] === null}
          onChange={onChange}
          onDisable={() => onDisable('daily')}
          isModified={isModified('daily')}
          label='Daily Rate'
          isMoney
        />
      </div>
      <span className='flex'/>
      <div style={{width: '48%'}}>
        <DisableableInput
          value={rateObj['monthly'] ?? ''} 
          inputId={`monthly-rate-${rateNumber}`}
          inputName='monthly'
          disabled={rateObj["monthly"] === null}
          onChange={onChange}
          onDisable={() => onDisable('monthly')}
          isModified={isModified('monthly')}
          label='Monthly Rate'
          isMoney
        />
      </div>
    </div>

    <div className='hbox'>  
      <div style={{width: '48%'}}>
        <DisableableInput
          value={rateObj['semesterly_fall_spring'] ?? ''} 
          inputId={`semesterly-fall-spring-rate-${rateNumber}`}
          inputName='semesterly_fall_spring'
          disabled={rateObj["semesterly_fall_spring"] === null}
          onChange={onChange}
          onDisable={() => onDisable('semesterly_fall_spring')}
          isModified={isModified('semesterly_fall_spring')}
          label='Semesterly Fall/Spring Rate'
          isMoney
        />
      </div>

      <span className='flex'/>

      <div style={{width: '48%'}}>
        <DisableableInput
          value={rateObj['semesterly_summer'] ?? ''} 
          inputId={`semesterly-summer-rate-${rateNumber}`}
          inputName='semesterly_summer'
          disabled={rateObj["semesterly_summer"] === null}
          onChange={onChange}
          onDisable={() => onDisable('semesterly_summer')}
          isModified={isModified('semesterly_summer')}
          label='Semesterly Summer Rate'
          isMoney
        />
      </div>
    </div>
    
    {/* yearly/event rate */}
    <div className='hbox'>  
      <div style={{width: '48%'}}>
        <DisableableInput
          value={rateObj['yearly'] ?? ''} 
          inputId={`yearly-rate-${rateNumber}`}
          inputName='yearly'
          disabled={rateObj["yearly"] === null}
          onChange={onChange}
          onDisable={() => onDisable('yearly')}
          isModified={isModified('yearly')}
          label='Yearly Rate'
          isMoney
        />
      </div>
      <span className='flex' />
      <div style={{width: '48%'}}>
        <DisableableInput
          value={rateObj['event_parking_price'] ?? ''} 
          inputId={`event-parking-price-${rateNumber}`}
          inputName='event_parking_price'
          disabled={rateObj["event_parking_price"] === null}
          onChange={onChange}
          onDisable={() => onDisable('event_parking_price')}
          isModified={isModified('event_parking_price')}
          label='Event Parking Price'
          isMoney
        />
      </div>
    </div>  

    {/* sheet */}
    <div className='hbox'>  
      <div style={{width: '48%'}}>
        <DisableableInput
          value={rateObj['sheet_number'] ?? ''} 
          inputId={`sheet-number-${rateNumber}`}
          inputName='sheet_number'
          disabled={rateObj["sheet_number"] === null}
          onChange={onChange}
          onDisable={() => onDisable('sheet_number')}
          isModified={isModified('sheet_number')}
          label='Sheet Number'
          isInt
        />
      </div>
      <span className='flex' />
      <div style={{width: '48%'}}>
        <DisableableInput
          value={rateObj['sheet_price'] ?? ''} 
          inputId={`sheet-price-${rateNumber}`}
          inputName='sheet_price'
          disabled={rateObj["sheet_price"] === null}
          onChange={onChange}
          onDisable={() => onDisable('sheet_price')}
          isModified={isModified('sheet_price')}
          label='Sheet Price'
          isMoney
        />
      </div>
    </div>  
  </>);
}

export default EditRate;