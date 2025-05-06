import { Collapsible } from '.';

export default function EditLotCapacity({ 
  formData, setFormData, 
  originalData,
  formType,
  openCapacity, setOpenCapacity,
  getNewCapacity, 
  capacityErr 
}){ 
  const MAX_TYPE_CAPACITY = 9999;

  const handleCapacityChange = (e, type) => {
    let value = e.target.valueAsNumber;
    value = isNaN(value) ? '' : value;
    setFormData(prev => {
      const newCapacity = prev.capacity;
      newCapacity[`${type}_capacity`] = value;
      return { ...prev, newCapacity};
    });
  };

  const numericKeyDown = (e) => {
    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
      e.preventDefault();
    }
  };

  const anyCapacityModified = () => {
    return [
      'commuter_core', 'commuter_perimiter', 'commuter_satellite', 'resident',
      'faculty', 'metered', 'ev_charging', 'ada', 'general'
    ].some(str => isCapacityModified(str))
  };

  const isCapacityModified = (field) => {
    if(formType === 'add') return false;
    else if(formData.capacity[`${field}_capacity`] === undefined) return false;
    return originalData.current.capacity[`${field}_capacity`] !== formData.capacity[`${field}_capacity`]
  };

  return (<>
    <Collapsible 
      name={`Capacity`} 
      className={'capacity-collapsible'}
      wideCollapse
      persistentChildren
      startOpen={formType === 'add'}
      asterisk={formType === 'add' || anyCapacityModified()}
      externalOpen={openCapacity} externalSetOpen={setOpenCapacity}
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
        <label className='flex' htmlFor='ada-capacity'>EV Charging{isCapacityModified('ev_charging') ? '*' : ''}
          <input id='ev-charging-capacity' autoComplete='off'
            type="number" min="0" step="1" max={`${MAX_TYPE_CAPACITY}`}
            onChange={(e) => handleCapacityChange(e, 'ev_charging')}
            value={formData.capacity.ev_charging_capacity}
            onKeyDown={numericKeyDown}
            className={`${isCapacityModified('ev_charging') && 'field-modified'}`}
          />
        </label>
        <label className='flex'>ADA{isCapacityModified('ada') ? '*' : ''}
          <input id='ada-capacity' autoComplete='off'
            type="number" min="0" step="1" max={`${MAX_TYPE_CAPACITY}`}
            onChange={(e) => handleCapacityChange(e, 'ada')}
            value={formData.capacity.ada_capacity}
            onKeyDown={numericKeyDown}
            className={`${isCapacityModified('ada') && 'field-modified'}`}
          />
        </label>
        <label className='flex'>General Capacity{isCapacityModified('general') ? '*' : ''}
          <input id='general-capacity' autoComplete='off'
            type="number" min="0" step="1" max={`${MAX_TYPE_CAPACITY}`}
            onChange={(e) => handleCapacityChange(e, 'general')}
            value={formData.capacity.general_capacity}
            onKeyDown={numericKeyDown}
            className={`${isCapacityModified('general') && 'field-modified'}`}
          />
        </label>
      </div>

      <span style={{display: 'inline-block', marginTop: '5px'}}>
        <strong>Total Capacity: </strong> {formData.capacity.capacity}
      </span>
      {formData.capacity.capacity !== getNewCapacity() && (
        <span style={{display: 'inline-block', marginTop: '5px', marginLeft: '30px'}}>
          <strong>New Capacity: </strong> {getNewCapacity()}
        </span>
      )}
      <div className='lot-form-error' ref={capacityErr} />
    </Collapsible>
  </>);
}