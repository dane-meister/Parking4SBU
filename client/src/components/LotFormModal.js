import Modal from 'react-modal';
import { Collapsible } from '.';
import { useEffect, useState } from 'react';
import '../stylesheets/LotFormModal.css'

Modal.setAppElement('#root'); // should only render once, or else constant warnings!


export default function LotFormModal({ isOpen, onRequestClose, lot }){
  const [formData, setFormData] = useState({
    name: '',
    coordinates: [],
    capacity: {},
    rates: []
  });

  useEffect(() => {
    let coords = lot?.location?.coordinates
    if(!!coords) coords = coords.map(coord => coord.join(", "));
    setFormData({
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
      rates: lot?.Rates ?? []
    });
    console.log("formdata:",formData)
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
      <h2 className='lot-edit-h2'>Lot Edit</h2>
      <section class='padding-wrapper' style={{padding: '25px', paddingTop: '0px'}}>
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
            return <div className='hbox'>
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
        many to come
      </Collapsible>
      <Collapsible 
        name={'Rates'} 
        className={'rates-collapsible'}
        startOpen={false}
        wideCollapse
      >
        many to come
      </Collapsible>
      </section>
    </Modal>
  );
}

function LotFormModalWrapper({children}){
  return children;
}

const styles = {
  content: {
    marginTop: 'calc(60px + 30px)',
    width: '500px',
    maxHeight: 'min(60vh, 800px)',
    minHeight: '600px',
    justifySelf: 'center',
    alignSelf: 'center',
    padding: '0',
    zIndex: 3000,
    border: 'none'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  lbl: {
    display: 'block',
  },
};