import { Collapsible } from '.';

export default function EditLotCapacity({ formData, setFormData, originalData, coordinatesErr, formType, openLocation, setOpenLocation }){
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

  const isCoordinateModified = (idx) => {
    if(formType === 'add' || !originalData || !originalData.current || !formData){
      return false;
    }

    if(originalData.current.coordinates.length <= idx){
      return true; // new point
    }
    
    const current = formData.coordinates[idx].replaceAll(' ', '');
    const original = originalData.current.coordinates[idx].replaceAll(' ', '');
    if(current.split(',').length != 2){ return true; }

    const [c_lat, c_lon] = current.split(',');
    const [o_lat, o_lon] = original.split(',');

    return (Number(c_lat) !== Number(o_lat)) || (Number(c_lon) !== Number(o_lon))
  };

  return (<>
    <Collapsible
      name={'Location'}
      subtext={'(Latitude, Longitude)'}
      className={'location-collapsible'}
      startOpen={formType === 'add'}
      wideCollapse
      persistentChildren
      asterisk={formType === 'add' || formData.coordinates.some((c, idx) => isCoordinateModified(idx))}
      externalOpen={openLocation} externalSetOpen={setOpenLocation}
    >
      <div>
        {formData.coordinates.map((coord, idx) => {
          return <div className='hbox' key={idx}>
            <label className='hbox lot-point-box flex' key={idx}>
              <span style={{marginRight: '10px'}}>Point {idx + 1}:</span>
              <input 
                className={`flex ${isCoordinateModified(idx) ? 'field-modified' : ''}`} 
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
        
        {formData.coordinates.length < 10 && (
          <button onClick={addLocationPoint} type="button">Add more points</button>
        )}
        <div className='lot-form-error' ref={coordinatesErr} />
      </div>
    </Collapsible>
  </>);
}