import Modal from 'react-modal';
import { Collapsible } from '.';
import { useEffect, useState } from 'react';

Modal.setAppElement('#root'); // should only render once, or else constant warnings!


export default function LotFormModal({ isOpen, onRequestClose, lot }){
  const [formData, setFormData] = useState({
    name: '',
  });
  
  useEffect(() => {
    setFormData(lot);
    console.log(formData)
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  return (
    <Modal 
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      id='lot-form-modal'
      style={styles}
    >
      <h2 style={{marginTop: 0, marginBottom: '10px'}}>Lot Edit</h2>
      <div>
        <label htmlFor='lot-name' className='lot-lbl' style={styles.lbl}>
          Name
        </label>
        <input name='name' id='lot-name' value={formData?.name} onChange={handleInputChange} autoComplete='off'/>
      </div>

      <Collapsible
        name={'Location'}
        className={'location-collapsible'}
        startOpen={false}
        wideCollapse
      >
        <div>
          <div className='hbox' style={{gap: '20px'}}>
            <label className='hbox'>
              <span style={{marginRight: '10px'}}>Longitude:</span>
              <input id='lot-long' />
            </label>
            <label className='hbox'>
              <span style={{marginRight: '10px'}}>Latitude:</span>
              <input id='lot-lat' />
            </label>
          </div>
          <button>Add more points</button><button>Switch input format</button>
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
    </Modal>
  );
}

function LotFormModalWrapper({children}){
  return children;
}

const styles = {
  content: {
    marginTop: 'calc(60px + 20px)',
    width: '500px',
    maxHeight: '600px',
    justifySelf: 'center',
    padding: '25px',
  },
  Overlay: {
    filter: 'brightness(.6)'
  },
  lbl: {
    display: 'block',
  },
};