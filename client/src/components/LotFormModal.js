import Modal from 'react-modal';
import { Collapsible, EditRate } from '.';
import { useEffect, useRef, useState } from 'react';
import '../stylesheets/LotFormModal.css'
import formatMoney from '../utils/formatMoney'
Modal.setAppElement('#root'); // should only render once, or else constant warnings!

export default function LotFormModal({ isOpen, onRequestClose, lot, formType }){
  const [formData, setFormData] = useState({
    name: '',
    coordinates: [],
    capacity: {},
    rates: [],
  });

  const originalData = useRef({});
  useEffect(() => {
    let coords = lot?.location?.coordinates
    if(!!coords) coords = coords.map(coord => coord.join(", "));

    let rates = lot?.Rates
    if(!!rates){
      rates = JSON.parse(JSON.stringify(rates)) // deep copy 
      rates.map(rate => {
        const fieldsToFormat = [
          'hourly', 'daily', 'monthly', 'semesterly_fall_spring', 
          'semesterly_summer', 'yearly', 'event_parking_price', 'sheet_price'
        ];
        for(const field of Object.keys(rate)){
          if(rate[field] !== null && (fieldsToFormat.includes(field))){
            rate[field] = formatMoney(rate[field])
          }
        }
      });
    }

    const data = {
      name: lot?.name ?? '',
      coordinates: coords ?? [],
      capacity: {
        ada_capacity: lot?.ada_capacity ?? 0,
        commuter_core_capacity: lot?.commuter_core_capacity ?? 0,
        commuter_perimeter_capacity: lot?.commuter_perimeter_capacity ?? 0,
        commuter_satellite_capacity: lot?.commuter_satellite_capacity ?? 0,
        ev_charging_capacity: lot?.ev_charging_capacity ?? 0,
        faculty_capacity: lot?.faculty_capacity ?? 0,
        metered_capacity: lot?.metered_capacity ?? 0,
        resident_capacity: lot?.resident_capacity ?? 0,
        capacity: lot?.capacity ?? 0
      },
      rates: rates ?? []
    }
    setFormData(data);
    originalData.current = JSON.parse(JSON.stringify(data));
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleLocationChange = (e, idx) => {
    const value = e.target.value

    setFormData(prev => {
      const newCoords = prev.coordinates;
      newCoords[idx] = value;
      return {...prev, coordinates: newCoords};
    })
  };

  const addLocationPoint = () => {
    setFormData(prev => {
      const newCoords = [...prev.coordinates, ''];
      return { ...prev, coordinates: newCoords };
    })
  }

  const removeLocationPoint = (idx) => {
    setFormData(prev => {
      const newCoords = prev.coordinates.toSpliced(idx, 1);
      return { ...prev, coordinates: newCoords };
    })
  };

  const handleCapacityChange = (e, type) => {
    let value = e.target.valueAsNumber;
    value = isNaN(value) ? '' : value;
    setFormData(prev => {
      const newCapacity = prev.capacity;
      newCapacity[`${type}_capacity`] = value;
      return { ...prev, newCapacity};
    });
  };

  const handleRateChange = (e, rateIdx) => {
    setFormData(prev => {
      const newRates = prev.rates;
      newRates[rateIdx][e.target.name] = e.target.value
      return { ...prev}
    });
    console.log(formData.rates)
  }

  const getNewCapacity = () => {
    const c = formData.capacity;
    return (c.commuter_core_capacity || 0) +
      (c.commuter_perimeter_capacity || 0) +
      (c.commuter_satellite_capacity || 0) +
      (c.resident_capacity || 0) +
      (c.faculty_capacity || 0) +
      (c.metered_capacity || 0) +
      (c.ev_charging_capacity || 0) +
      (c.ada_capacity || 0)
  };
  const MAX_TYPE_CAPACITY = 9999;
  const numericKeyDown = (e) => {
      if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
        e.preventDefault();
      }
      // let new_value = Number(e.target.value + e.key);
      // if(new_value > MAX_TYPE_CAPACITY) e.preventDefault();
  };

  const isCapacityModified = (field) => {
    if(formData.capacity[`${field}_capacity`] === undefined) return false;
    return originalData.current.capacity[`${field}_capacity`] !== formData.capacity[`${field}_capacity`]
  };
  // stops background scrolling
  if(isOpen){
    document.body.style.overflow = 'hidden';
  }else{
    document.body.style.overflow = 'unset';
  }

  return (
    <Modal 
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      id='lot-form-modal'
      style={styles}
    >
      <h2 className='lot-edit-h2 hbox'>
        {formType==='add' ? 'Lot Add' : 'Lot Edit'}
        <span className='flex'/>
        <img className='hover-black' src='/images/x.png' alt='close'
          style={{filter: 'invert(1)', height: '29px', padding: '1px 0'}}
          onClick={onRequestClose}
        />
      </h2>
      <section className='padding-wrapper' style={{padding: '0 15px 25px 15px'}}>
      <div className='name-uncollapsible'>
        <label htmlFor='lot-name' className='lot-lbl' style={styles.lbl}>
          Name
        </label>
        <input name='name' id='lot-name' value={formData?.name} onChange={handleInputChange} autoComplete='off'/>
      </div>

      <Collapsible
        name={'Location'}
        subtext={'(Latitude, Longitude)'}
        className={'location-collapsible'}
        startOpen={false}
        wideCollapse
      >
        <div>
          {formData.coordinates.map((coord, idx) => {
            return <div className='hbox' key={idx}>
              <label className='hbox lot-point-box flex' key={idx}>
                <span style={{marginRight: '10px'}}>Point {idx + 1}:</span>
                <input 
                  className="flex" 
                  name='lot-lat-long' 
                  id={`lot-lat-long-${idx}`} 
                  value={formData.coordinates[idx]}
                  onChange={e => handleLocationChange(e, idx)}
                  autoComplete='off'
                />
              </label>
              {formData.coordinates.length > 1 && (
                <img src='/images/x.png' alt='x' className='lot-point-remove'
                  onClick={() => removeLocationPoint(idx)}
                />
              )}
            </div>
          })}
          
          {formData.coordinates.length < 16 && (
            <button onClick={addLocationPoint}>Add more points</button>
          )}
        </div>
      </Collapsible>

      <Collapsible 
        name={'Capacity'} 
        className={'capacity-collapsible'}
        startOpen={false}
        wideCollapse
      >
        {/* 
        [3] ada_capacity
        [1] commuter_core_capacity
        [1] commuter_perimeter_capacity: 
        [1] commuter_satellite_capacity:
        [3] ev_charging_capacity: 
        faculty_capacity: 
        metered_capacity: 
        resident_capacity:
        capacity 
        */}

        <div className='hbox' style={{gap: '15px', fontSize: '14px'}}>
          <label className='flex'>Commuter Core{isCapacityModified('commuter_core') ? '*' : ''}
            <input id='commuter-core-capacity' autoComplete='off'
              type="number" min="0" step="1" max={`${MAX_TYPE_CAPACITY}`}
              onChange={(e) => handleCapacityChange(e, 'commuter_core')}
              value={formData.capacity.commuter_core_capacity}
              onKeyDown={numericKeyDown}
              className={`${isCapacityModified('commuter_core') && 'field-modified'}`}
            />
          </label>
          <label className='flex'>Commuter Perimeter{isCapacityModified('commuter_perimeter') ? '*' : ''}
            <input id='commuter-perimeter-capacity' autoComplete='off'
              type="number" min="0" step="1" max={`${MAX_TYPE_CAPACITY}`}
              onChange={(e) => handleCapacityChange(e, 'commuter_perimeter')}
              value={formData.capacity.commuter_perimeter_capacity}
              onKeyDown={numericKeyDown}
              className={`${isCapacityModified('commuter_perimeter') && 'field-modified'}`}
            />
          </label>
          <label className='flex'>Commuter Satellite{isCapacityModified('commuter_satellite') ? '*' : ''}
            <input id='commuter-satellite-capacity' autoComplete='off'
              type="number" min="0" step="1" max={`${MAX_TYPE_CAPACITY}`}
              onChange={(e) => handleCapacityChange(e, 'commuter_satellite')}
              value={formData.capacity.commuter_satellite_capacity}
              onKeyDown={numericKeyDown}
              className={`${isCapacityModified('commuter_satellite') && 'field-modified'}`}
            />
          </label>
        </div>

        <div className='hbox' style={{gap: '15px', fontSize: '14px'}}>
          <label className='flex'>Resident{isCapacityModified('resident') ? '*' : ''}
            <input id='resident-capacity' autoComplete='off'
              type="number" min="0" step="1" max={`${MAX_TYPE_CAPACITY}`}
              onChange={(e) => handleCapacityChange(e, 'resident')}
              value={formData.capacity.resident_capacity}
              onKeyDown={numericKeyDown}
              className={`${isCapacityModified('resident') && 'field-modified'}`}
            />
          </label>
          <label className='flex'>Faculty{isCapacityModified('faculty') ? '*' : ''}
            <input id='faculty-capacity' autoComplete='off'
              type="number" min="0" step="1" max={`${MAX_TYPE_CAPACITY}`}
              onChange={(e) => handleCapacityChange(e, 'faculty')}
              value={formData.capacity.faculty_capacity}
              onKeyDown={numericKeyDown}
              className={`${isCapacityModified('faculty') && 'field-modified'}`}
            />
          </label>
          <label className='flex'>Metered{isCapacityModified('metered') ? '*' : ''}
            <input id='metered-capacity' autoComplete='off'
              type="number" min="0" step="1" max={`${MAX_TYPE_CAPACITY}`}
              onChange={(e) => handleCapacityChange(e, 'metered')}
              value={formData.capacity.metered_capacity}
              onKeyDown={numericKeyDown}
              className={`${isCapacityModified('metered') && 'field-modified'}`}
            />
          </label>
        </div>
        
        <div className='hbox' style={{gap: '15px', fontSize: '14px'}}>
          <span style={{flex: 1}}/> 
          <label style={{flex: 2}} htmlFor='ada-capacity'>EV Charging{isCapacityModified('ev_charging') ? '*' : ''}
            <input id='ev-charging-capacity' autoComplete='off'
              type="number" min="0" step="1" max={`${MAX_TYPE_CAPACITY}`}
              onChange={(e) => handleCapacityChange(e, 'ev_charging')}
              value={formData.capacity.ev_charging_capacity}
              onKeyDown={numericKeyDown}
              className={`${isCapacityModified('ev_charging') && 'field-modified'}`}
            />
          </label>
          <label className='flex' style={{flex: 2}}>ADA{isCapacityModified('ada') ? '*' : ''}
            <input id='ada-capacity' autoComplete='off'
              type="number" min="0" step="1" max={`${MAX_TYPE_CAPACITY}`}
              onChange={(e) => handleCapacityChange(e, 'ada')}
              value={formData.capacity.ada_capacity}
              onKeyDown={numericKeyDown}
              className={`${isCapacityModified('ada') && 'field-modified'}`}
            />
          </label>
          <span style={{flex: 1}}/> 
        </div>

        <span style={{display: 'inline-block', marginTop: '5px'}}>
          <strong>Total Capacity: </strong> {formData.capacity.capacity}
        </span>
        {formData.capacity.capacity !== getNewCapacity() && (
          <span style={{display: 'inline-block', marginTop: '5px', marginLeft: '30px'}}>
            <strong>New Capacity: </strong> {getNewCapacity()}
          </span>
        )}
      </Collapsible>

      <Collapsible 
        name={'Rates'} 
        className={'rates-collapsible'}
        startOpen={false}
        wideCollapse
      >
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
          () semesterly_fall_spring: null
          () semesterly_summer: null
          (-) yearly: 0
          () event_parking_price: null
          () sheet_number: null
          () sheet_price: null
        */}
        <div><label htmlFor='permit-select'>Permit Type</label></div>
        <select id='permit-select' style={{width: '48%'}}>
          <option></option>
          <option>Dont check, i didnt do this yet</option>
        </select>
        
        {/* rate times */}

        {/* hourly rate */}
        <div className='hbox'>  
          <div style={{width: '48%'}}>
            <label htmlFor='hourly-rate'>Hourly Rate</label>
            <div className='disableable-input flex'>
              <input id='hourly-rate' autoComplete='off'/>
              <button><img src='/images/disable.png' alt='disable'/></button>
            </div>
          </div>
          <span className='flex'/>
          <div style={{width: '48%'}}>
            <label htmlFor='max-hours'>Max Hours</label>
            <div className='disableable-input flex'>
              <input id='max-hours' autoComplete='off'/>
              <button><img src='/images/disable.png' alt='disable'/></button>
            </div>
          </div>
        </div>

        {/* daily rate */}
        <div className='hbox'>  
          <div style={{width: '48%'}}>
            <label htmlFor='daily-rate'>Daily Rate</label>
            <div className='disableable-input flex'>
              <input id='daily-rate' autoComplete='off'/>
              <button><img src='/images/disable.png' alt='disable'/></button>
            </div>
          </div>
        </div>

        {/* monthly rate */}
        <div className='hbox'>  
          <div style={{width: '48%'}}>
            <label htmlFor='monthly-rate'>Monthly Rate</label>
            <div className='disableable-input flex'>
              <input id='monthly-rate' autoComplete='off'/>
              <button><img src='/images/disable.png' alt='disable'/></button>
            </div>
          </div>
        </div>

        semester
        
        {/* yearly rate */}
        <div className='hbox'>  
          <div style={{width: '48%'}}>
            <label htmlFor='yearly-rate'>Yearly Rate</label>
            <div className='disableable-input flex'>
              <input id='yearly-rate' autoComplete='off'/>
              <button><img src='/images/disable.png' alt='disable'/></button>
            </div>
          </div>
        </div>

        {formData.rates.map((rate, idx) => (
          <EditRate 
            rateObj={rate} 
            key={idx} 
            rateNumber={idx} 
            onChange={(e) => handleRateChange(e, idx)}
            setFormData={setFormData}
            originalRateObj={originalData.current.rates[idx]}
          />)
        )}
      </Collapsible>

      <span style={{display: 'block', borderTop: '#aaa solid 1px'}}/>
      </section>
    </Modal>
  );
}

const styles = {
  content: {
    marginTop: 'calc(60px + 30px)',
    width: '525px',
    maxHeight: 'min(60vh, 800px)',
    minHeight: '600px',
    justifySelf: 'center',
    alignSelf: 'center',
    padding: '0',
    zIndex: 3000,
    border: 'none',
    overflow: 'auto'
    // scrollbarGutter: 'stable'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  lbl: {
    display: 'block',
  },
};