import Modal from 'react-modal';
import { EditLotCapacity, EditLotLocation, EditRateForm, EditLotOther } from '.';
import { useEffect, useRef, useState } from 'react';
import '../stylesheets/LotFormModal.css'
import formatMoney from '../utils/formatMoney'
import { isNonNullAndEmpty, isNullOrHasMoneyPrecision } from '../utils/validateField';
import axios from 'axios';
const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000";
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
      rates.forEach((rate, idx) => {
        rate['rateNumber'] = idx;

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

      rates = Object.assign({}, rates);
    }
    const defaultCapacity = 0;
    const data = {
      name: lot?.name ?? '',
      coordinates: coords ?? [],
      capacity: {
        ada_capacity: lot?.ada_capacity ?? defaultCapacity,
        commuter_core_capacity: lot?.commuter_core_capacity ?? defaultCapacity,
        commuter_perimeter_capacity: lot?.commuter_perimeter_capacity ?? defaultCapacity,
        commuter_satellite_capacity: lot?.commuter_satellite_capacity ?? defaultCapacity,
        ev_charging_capacity: lot?.ev_charging_capacity ?? defaultCapacity,
        faculty_capacity: lot?.faculty_capacity ?? defaultCapacity,
        metered_capacity: lot?.metered_capacity ?? defaultCapacity,
        resident_capacity: lot?.resident_capacity ?? defaultCapacity,
        capacity: lot?.capacity ?? defaultCapacity,
        general_capacity: lot?.general_capacity ?? defaultCapacity
      },
      rates: rates ?? [],
      numRates: rates ? Object.keys(rates).length : 0,
      covered: lot?.covered ?? false,
      resident_zone: lot?.resident_zone ?? null
    }
    setFormData(data);
    if(formType === 'add'){
      const emptyRate = {
        daily: null,
        event_parking_price: null,
        hourly: null,
        lot_start_time: "07:00:00",
        lot_end_time: "16:00:00",
        max_hours: null,
        monthly: null,
        parking_lot_id: null,
        permit_type: 'Core',
        semesterly_fall_spring: null,
        semesterly_summer: null,
        sheet_number: null,
        sheet_price: null,
        yearly: null,
        rateNumber: 0
      };
      setFormData(prev => {
        return { ...prev, coordinates: [''], rates: [emptyRate], numRates: 1 }
      });
    }
    originalData.current = JSON.parse(JSON.stringify(data));
    
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const getNewCapacity = () => {
    const c = formData.capacity;
    return (c.commuter_core_capacity || 0) + 
      (c.commuter_perimeter_capacity || 0) +
      (c.commuter_satellite_capacity || 0) +
      (c.resident_capacity || 0) +
      (c.faculty_capacity || 0) +
      (c.metered_capacity || 0) +
      (c.ev_charging_capacity || 0) +
      (c.ada_capacity || 0) +
      (c.general_capacity || 0)

  };

  const MAX_TOTAL_CAPACITY = 10000;

  const nameErr = useRef(null);
  const coordinatesErr = useRef(null);
  const capacityErr = useRef(null);
  const otherErrs = useRef(null);

  const [rateErrMsgs, setRateErrMsgs] = useState({});
  useEffect(() => setRateErrMsgs({}), [isOpen]);
  const anyRateErrs = (rateErrMsgs) => {
    if(rateErrMsgs.length === 0) return true;

    for(const index in rateErrMsgs){
      const currentRateErrMsgs = rateErrMsgs[index];
      for(const key in currentRateErrMsgs){
        if(currentRateErrMsgs[key] !== '') return true;
      }
    }

    return false;
  };

  const validateRate = (rateObj) => {
    const currentRateErrMsgs = {};
    // permit type checks
    // - empty rn

    // time checks
    const isEndBeforeStart = (start, end) => Number(end.slice(0, 2)) < Number(start.slice(0, 2));
    if(isEndBeforeStart(rateObj.lot_start_time, rateObj.lot_end_time)){
      currentRateErrMsgs['times'] = 'Start time must be before end time!';
    }else{
      currentRateErrMsgs['times'] = '';
    }

    // price checks
    [
      'hourly', 'daily', 'monthly', 'semesterly_fall_spring',
      'semesterly_summer', 'yearly', 'event_parking_price', 'sheet_price'
    ].forEach(key => {
      if(isNonNullAndEmpty(rateObj[key])){
        currentRateErrMsgs[key] = "Rate cannot be empty if nonnull!";
      }else if(!isNullOrHasMoneyPrecision(rateObj[key])){
        currentRateErrMsgs[key] = "Rate must be a valid dollar amount!";
      }else{
        currentRateErrMsgs[key] = '';
      }
    });

    // positive int checks
    ['max_hours', 'sheet_number'].forEach(key => {
      const value = rateObj[key];
      if(isNonNullAndEmpty(value)){
        currentRateErrMsgs[key] = "Number cannot be empty if nonnull!";
      }else if(value !== null && value == 0){
        currentRateErrMsgs[key] = "Number must be larger than 0!";
      }else{
        currentRateErrMsgs[key] = "";
      }

      //sheet checks
      if(rateObj.sheet_number !== null && rateObj.sheet_price === null){
        // dont override previous errors
        if(!isNonNullAndEmpty(rateObj.sheet_number)){
          currentRateErrMsgs['sheet_number'] = 'Sheet number must have a sheet price!'
        }
      }else if(rateObj.sheet_number === null && rateObj.sheet_price !== null){
        const value = rateObj.sheet_price;
        if(!isNonNullAndEmpty(rateObj.sheet_price) && !(value !== null && value == 0)){
          currentRateErrMsgs['sheet_price'] = 'Sheet price must have a sheet number!'
        }
      }
    });

    return currentRateErrMsgs;
  };

  const handleEditSubmit = (e) => {
    e.preventDefault()

    let errorOccurred = false;
    // name 
    if(!formData.name.trim()){
      nameErr.current.innerHTML = 'Lot name cannot be empty!';
      errorOccurred = true;
    }else{
      nameErr.current.innerHTML = '';
    }

    // location
      //check empty
    const emptyCoords = [];
    formData.coordinates.forEach((coord, index) => {
      if(!coord.trim()) emptyCoords.push({ coord, index })
    });
      // check format
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
      coordinatesErr.current.innerHTML = `Lot coordinates cannot be empty! ${emptyPnts}`
      errorOccurred = true;
    }else if(!!improperFormatCoords.length){
      const improperFormatPnts = `(Point${improperFormatCoords.length !== 1 ? 's' : ''} ${improperFormatCoords.map(c => c.index + 1).join(', ')})`;
      coordinatesErr.current.innerHTML = `Lot coordinates must be valid numbers in the format "Latitude, Longitude"!\n${improperFormatPnts}`
      errorOccurred = true;
    }else if(!!impreciseCoords.length){
      const imprecisePnts = `(Point${impreciseCoords.length !== 1 ? 's' : ''} ${impreciseCoords.map(c => c.index + 1).join(', ')})`
      coordinatesErr.current.innerHTML = `All lot coordinates needs 2 decimal places of precision! ${imprecisePnts}`
      errorOccurred = true;
    }else{
      coordinatesErr.current.innerHTML = '';
    }

    if(!!coordinatesErr.current.innerHTML) setOpenLocation(true);

    // capacity
      // check for empty
    const emptyCaps = [];
    for(const [key, value] of Object.entries(formData.capacity)){
      if(key === 'capacity') continue; // this field isnt directly edited
      if(value === undefined || value === '') emptyCaps.push(key);
    }
    const formatCapKey = (cap) => {
      return cap.replace('_capacity', '')
        .replaceAll('_', ' ')
        .replace(             // to title case
          /\w\S*/g,
          text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
        )
        .replace('Ev', 'EV');
    }
    if(!!emptyCaps.length){
      capacityErr.current.innerHTML = `Capacities cannot be empty! (${emptyCaps.map(c => formatCapKey(c)).join(', ')} capacit${emptyCaps.length !== 1 ? 'ies' : 'y'})`
      errorOccurred = true;
    }else if(getNewCapacity() > MAX_TOTAL_CAPACITY){
      capacityErr.current.innerHTML = `New Capacity too large! (total capacity must be lower than ${MAX_TOTAL_CAPACITY})`
      errorOccurred = true;
    }else{
      capacityErr.current.innerHTML = '';
    }

    if(!!capacityErr.current.innerHTML) setOpenCapacity(true);

    // rate
    const rateErrs = {};
    Object.values(formData.rates).forEach(rateObj => {
      const rateErrMsg = validateRate(rateObj);
      rateErrs[rateObj.rateNumber] = rateErrMsg;
    });
    setRateErrMsgs(rateErrs);

    if(anyRateErrs(rateErrs)){
      setOpenRates(true);
      errorOccurred = true;
    }

    // other
    if(isNonNullAndEmpty(formData.resident_zone)){
      otherErrs.current.innerHTML = 'Resident Zone cannot be empty if nonnull!';
      errorOccurred = true;
    }else{
      otherErrs.current.innerHTML = '';
    }
    //alert?
    if(errorOccurred) {
      alert(`Error ${formType === 'add' ? 'adding' : 'editing'} lot!`);
      return;
    }else{
      editAddLot();
    }
  }

  const editAddLot = async () => {
    const { name, coordinates, capacity, rates, covered, resident_zone } = formData;
    if(formType === 'add'){
      await axios.post(`${HOST}/api/admin/lots/add`,
        { 
          name, 
          coordinates, 
          capacity, 
          rates: Object.values(rates), 
          covered,
          resident_zone
        }, 
        { withCredentials: true }
      )
        .then(() => {
          onRequestClose()
        })
        .catch((err) => {
          alert(err.message)
        });
    }else{
      alert('Edit Modal!!');
    }
    // console.log(response)
  };
  // stops background scrolling
  if(isOpen){
    document.body.style.overflow = 'hidden';
  }else{
    document.body.style.overflow = 'unset';
  }

  const [openLocation, setOpenLocation] = useState(false);
  const [openCapacity, setOpenCapacity] = useState(false);
  const [openRates, setOpenRates] = useState(false);
  const [openOther, setOpenOther] = useState(false);
  useEffect(() => {
    const isAddingLot = formType === 'add';
    setOpenLocation(isAddingLot);
    setOpenCapacity(isAddingLot);
    setOpenRates(isAddingLot);
    setOpenOther(isAddingLot);
  }, [isOpen]);

  return (
    <Modal 
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      id='lot-form-modal'
      style={styles}
    >
      <form onSubmit={handleEditSubmit}>
      <h2 className='lot-edit-h2 hbox'>
        {formType==='add' ? 'Lot Add' : 'Lot Edit'}
        <span className='flex'/>
        <img className='hover-black' src='/images/x.png' alt='close'
          style={{height: '29px', padding: '1px 0'}}
          onClick={onRequestClose}
        />
      </h2>
      <section className='padding-wrapper' style={{padding: '0 15px 25px 15px'}}>
      <div className='name-uncollapsible'>
        <label htmlFor='lot-name' className='lot-lbl' style={styles.lbl}>
          Name{(formType === 'add' || (!!originalData.current.name && originalData.current.name.trim() !== formData.name.trim())) && '*'}
        </label>
        <input name='name' id='lot-name' value={formData?.name} autoComplete='off' 
          onChange={handleInputChange} 
          className={formType !== 'add' && !!originalData.current.name && originalData.current.name.trim() !== formData.name.trim() ? 'field-modified' : ''}
        />
        <div className='lot-form-error' ref={nameErr} />
      </div>

      
      <EditLotLocation 
        formData={formData} setFormData={setFormData} 
        originalData={originalData}
        coordinatesErr={coordinatesErr}
        formType={formType}
        openLocation={openLocation} setOpenLocation={setOpenLocation}
      />
      
      <EditLotCapacity 
        formData={formData} setFormData={setFormData} 
        originalData={originalData}
        getNewCapacity={getNewCapacity}
        capacityErr={capacityErr}
        formType={formType}
        openCapacity={openCapacity} setOpenCapacity={setOpenCapacity}
      />

      <EditRateForm 
        formData={formData} setFormData={setFormData} 
        originalData={originalData}
        formType={formType}
        openRates={openRates} setOpenRates={setOpenRates}
        rateErrMsgs={rateErrMsgs}
      />

      <span style={{display: 'block', borderTop: '#aaa solid 1px'}}/>

      <EditLotOther 
        formData={formData} setFormData={setFormData}
        originalData={originalData}
        formType={formType}
        openOther={openOther} setOpenOther={setOpenOther}
        otherErrs={otherErrs} 
      />

      <p style={{margin: '10px 0px -8px 0', fontSize: '13px', color: 'var(--gray)'}}>
        {`* ${formType === 'edit' ? 'edited' : 'required'} fields`}
      </p>
      <input type='submit' className='edit-lot-btn' 
        value={formType === 'add'? 'Add Lot' : 'Edit Lot'} 
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