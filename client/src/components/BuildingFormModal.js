import Modal from 'react-modal';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../stylesheets/BuildingFormModal.css'

Modal.setAppElement('#root');

const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function BuildingFormModal({ isOpen, onRequestClose, building,  formType, refreshBuildingRefresh }) {
  const [formData, setFormData] = useState({});
  const [errorMsgs, setErrorMsgs] = useState({
    name: '',
    campus: '',
    coordinates: ''
  });

  const originalData = useRef({});
  useEffect(() => {
    // reset errors
    setErrorMsgs({
      name: '',
      campus: '',
      coordinates: ''
    });

    // load state
    let coords = building?.location?.coordinates
    if(!!coords) coords = coords.map(coord => coord.join(", "));

    const data = {
      name: building?.building_name ?? '',
      campus: building?.campus ?? '',
      coordinates: coords ?? [''],
    }
    
    setFormData(data);
    originalData.current = JSON.parse(JSON.stringify(data));
  }, [isOpen]);
  
  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(prev => {
      return { ...prev, [name]: value };
    })
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    // name checks
    if(!formData.name.trim()){
      setErrorMsgs(prev => ({ ...prev, name: 'Building name cannot be empty!' }));
    }else{
      setErrorMsgs(prev => ({ ...prev, name: '' }));
    }
    // campus checks
    // empty

    // location checks
    const emptyCoords = [];
    formData.coordinates.forEach((coord, index) => {
      if(!coord.trim()) emptyCoords.push({ coord, index })
    });

    const improperFormatCoords = [];
    formData.coordinates.forEach((coord, index) => {
      if(!coord.match(/^[ ]*-?\d+[.]?\d*[ ]*,[ ]*-?\d+[.]?\d*[ ]*$/)) 
        improperFormatCoords.push({ coord, index })
    });

    const impreciseCoords = [];
    formData.coordinates.forEach((coord, index) => {
      if(!coord.match(/^[ ]*-?\d+[.]\d{2,}[ ]*,[ ]*-?\d+[.]\d{2,}[ ]*$/)) 
        impreciseCoords.push({ coord, index })
    });

    if(!!emptyCoords.length){
      const emptyPnts = `(Point${emptyCoords.length !== 1 ? 's' : ''} ${emptyCoords.map(c => c.index + 1).join(', ')})`;
      setErrorMsgs(prev => ({ ...prev, coordinates: `Lot coordinates cannot be empty! ${emptyPnts}`}));
    }else if(!!improperFormatCoords.length){
      const improperFormatPnts = `(Point${improperFormatCoords.length !== 1 ? 's' : ''} ${improperFormatCoords.map(c => c.index + 1).join(', ')})`;
      setErrorMsgs(prev => ({ ...prev, coordinates: `Lot coordinates must be valid numbers in the format "Latitude, Longitude"!\n${improperFormatPnts}`}));
    }else if(!!impreciseCoords.length){
      const imprecisePnts = `(Point${impreciseCoords.length !== 1 ? 's' : ''} ${impreciseCoords.map(c => c.index + 1).join(', ')})`
      setErrorMsgs(prev => ({ ...prev, coordinates: `All lot coordinates needs 2 decimal places of precision! ${imprecisePnts}`}));
    }else{
      setErrorMsgs(prev => ({ ...prev, coordinates: '' }));
    }
  }

  const campuses = ['SBU WEST', 'SBU R&D', 'SBU EAST', 'SBU SOUTH'];  
  const setCampus = (e) => {
    setFormData(prev => {
      return { ...prev, campus: e.target.value }
    });
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

  const anyCoordinateModified = () => {
    if(!formData.coordinates) return false;

    return formData.coordinates
      .map((_, idx) => idx)
      .some((idx) => isCoordinateModified(idx));
  };

  const isModified = (field) => formType !== 'add' && formData[field] !== originalData.current[field];

  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      id="building-form-modal"
      style={styles}
    >
      <form onSubmit={handleEditSubmit}>
      <h2 className='lot-edit-h2 hbox'>
        {formType==='add' ? 'Building Add' : 'Building Edit'}
        <span className='flex'/>
        <img className='hover-black' src='/images/x.png' alt='close'
          style={{height: '29px', padding: '1px 0'}}
          onClick={onRequestClose}
        />
      </h2>
      
      <section className='padding-wrapper' style={{padding: '0 15px 25px 15px'}}>
        {/*     
          building_name
          campus
          location
          mercator_coordinates
        */}
        {/* building name input */}
        <div className='name-uncollapsible'>
          <label htmlFor='lot-name' className='lot-lbl' style={{display: 'block'}}>
            Name{(formType === 'add' || (!!originalData.current.name && originalData.current.name.trim() !== formData.name.trim())) && '*'}
          </label>
          <input name='name' id='building-name' value={formData?.name} autoComplete='off' 
            onChange={handleInputChange} 
            className={formType !== 'add' && !!originalData.current.name && originalData.current.name.trim() !== formData.name.trim() ? 'field-modified' : ''}
          />
          <div className='lot-form-error'>{errorMsgs.name}</div>
        </div>

        {/* campus drop down */}
        <div id='campus-wrapper' style={{ borderBottom: '#aaa solid 1px', paddingBottom: '10px'}}>
          <div style={{marginTop: '10px'}}>
            <label className='lot-lbl' htmlFor='campus'>Campus{(formType==='add' || isModified('campus')) && '*'}</label>
          </div>
          <select 
            id='campus' style={{width: '50%'}}
            value={formData.campus}
            onChange={setCampus}
            className={isModified('campus') ? 'field-modified' : ''}
          >
            {campuses.map((c, index) => (
              <option key={index} value={c}>{c}</option>
            ))}
          </select>
          <div className='lot-form-error' />
        </div>

        {/* location input */}
        <label htmlFor='lot-name' className='lot-lbl' style={{display: 'block', marginTop: '10px'}}>
            Location{(formType==='add' || anyCoordinateModified()) && '*'}
        </label>
        <div id='building-coordinates' style={{borderBottom: '#aaa solid 1px', paddingBottom: '10px'}}>
          {formData.coordinates && formData.coordinates.map((coord, idx) => {
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
          
          {formData.coordinates && formData.coordinates.length < 10 && (
            <button onClick={addLocationPoint} type="button">Add more points</button>
          )}
          <div className='lot-form-error'>{errorMsgs.coordinates}</div>
        </div>
      
        <p style={{margin: '10px 0px -8px 0', fontSize: '13px', color: 'var(--gray)'}}>
          {`* ${formType === 'edit' ? 'edited' : 'required'} fields`}
        </p>
        <input type='submit' className='edit-lot-btn' 
          value={formType === 'add' ? 'Add Building' : 'Edit Building'} 
        />

      </section>
      </form>
    </Modal>
  );
}

const styles = {
  content: {
    marginTop: 'calc(60px + 30px)',
    width: '525px',
    maxHeight: 'min(60vh, 800px)',
    // minHeight: '500px',
    justifySelf: 'center',
    alignSelf: 'center',
    padding: '0',
    zIndex: 3000,
    border: 'none',
    overflow: 'hidden'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  lbl: {
    display: 'block',
  },
};
