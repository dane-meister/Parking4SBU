import { DisableableInput, HourSelector } from '.';
import { useState } from 'react';

function EditRate({ 
  rateObj, 
  formData, setFormData, 
  originalRateObj, originalFormData, 
  errorMsgs, 
  formType,
  isModified, isRateModified
}){
  const rateNumber = rateObj.rateNumber
  
  const onDisable = (name) => {
    setFormData(prev => {
      const newRates = { ...prev.rates };
      newRates[rateNumber] = { ...newRates[rateNumber] };
      newRates[rateNumber][name] = prev.rates[rateNumber][name] === null ? '' : null;
      

      return { ...prev, rates: newRates};
    });
  };

  const onChange = (e) => {
    setFormData(prev => {
      const newRates = prev.rates;
      const newRate = newRates[rateNumber];
      newRate[e.target.name] = e.target.value;
      return { ...prev, rates: newRates };
    });
  }

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
  ];

  const removeRate = () => {
    setFormData(prev => {
      const newRates = formData.rates;
      delete newRates[rateNumber];

      return { ...prev, rates: newRates };
    });
  };

  const [timeEditMode, setTimeEditMode] = useState(null);
  const handleTimeSelect = (mode, formatted) => {
    setFormData(prev => {
      const newRates = { ...prev.rates };
      const newRate = newRates[rateNumber];
      newRate[mode] = formatted;

      return { ...prev, rates: newRates};
    });
    setTimeEditMode(null);
  };

  const formatHours = (hours) => {
    return new Date(`2000-01-01T${hours}Z`)
      .toLocaleTimeString('en-US',
        { timeZone:'UTC', hour12: true, hour: 'numeric', minute: 'numeric' }
      );
  };

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
    {rateNumber !== Object.values(formData.rates)[0].rateNumber && <div name='spacer' style={{height: '15px'}}/>}
    <div className='hbox lot-modal-rate-header'>
      <h2 style={{fontSize: '16px', padding: '5px'}}>{`Rate ${rateNumber+1}${isRateModified() ? '*' : ''}`}</h2>
      <span className='flex'/>
      <img src='/images/x.png' alt='close' 
        id='lot-modal-rate-close'
        style={{height: '20px', alignSelf: 'center', cursor: 'pointer'}}
        onClick={removeRate}
      />
    </div>

    <div>
      <label htmlFor={`permit-select-${rateNumber}`}>Permit Type{isModified('permit_type') && '*'}</label>
    </div>
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
    <div className='lot-form-error' />
    
    {/* rate times */}
    <div style={{fontSize: '14px', marginTop: '6px'}}>
      Rate Times{isModified('lot_start_time') || isModified('lot_end_time') ? '*' : ''}
    </div>
    <div className="time-selector-container">
      <div className="time-input">
        <span className="time-label" style={{fontStyle: 'italic'}}>Lot Start Time{isModified('lot_start_time') ? '*' : ''}:</span>
        <div className={`time-row ${isModified('lot_start_time') ? 'field-modified' : ''}`}>
          <span className="time-value">{formatHours(rateObj.lot_start_time)}</span>
          <button className="edit-button" type='button'
            onClick={() => setTimeEditMode("lot_start_time")}
          >
            <img src="/images/edit-icon1.png" alt="Edit Arrival" className="edit-icon" />
          </button>
        </div>
      </div>
      <div className="arrow-container">
        <img src="/images/arrow1.png" alt="Arrow" className="landing-arrow-icon" />
      </div>
      <div className="time-input">
        <span className="time-label" style={{fontStyle: 'italic'}}>Lot End Time{isModified('lot_end_time') ? '*' : ''}:</span>
        <div className={`time-row ${isModified('lot_end_time') ? 'field-modified' : ''}`}>
          <span className="time-value">{formatHours(rateObj.lot_end_time)}</span>
          <button className="edit-button" type='button'
            onClick={() => setTimeEditMode("lot_end_time")}
          >
            <img src="/images/edit-icon1.png" alt="Edit Departure" className="edit-icon" />
          </button>
        </div>
      </div>
      {timeEditMode && (
        <HourSelector
          mode={timeEditMode}
          initialTimes={{lot_start_time: rateObj.lot_start_time, lot_end_time: rateObj.lot_end_time}}
          onSelect={handleTimeSelect}
          onClose={() => setTimeEditMode(null)}
        />
      )}
    </div>
    <div className='lot-form-error' id='times-err'
      style={errorMsgs?.times ? {} : {marginTop: '2px'}}
    >{errorMsgs?.times}</div>
    
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
        <div className='lot-form-error'>{errorMsgs?.hourly}</div>
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
        <div className='lot-form-error'>{errorMsgs?.max_hours}</div>
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
        <div className='lot-form-error'>{errorMsgs?.daily}</div>
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
        <div className='lot-form-error'>{errorMsgs?.monthly}</div>
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
        <div className='lot-form-error'>{errorMsgs?.semesterly_fall_spring}</div>
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
        <div className='lot-form-error'>{errorMsgs?.semesterly_summer}</div>
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
        <div className='lot-form-error'>{errorMsgs?.yearly}</div>
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
        <div className='lot-form-error'>{errorMsgs?.event_parking_price}</div>
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
        <div className='lot-form-error'>{errorMsgs?.sheet_number}</div>
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
        <div className='lot-form-error'>{errorMsgs?.sheet_price}</div>
      </div>
    </div>  
  </>);
}

export default EditRate;