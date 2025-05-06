import { Collapsible, EditRate } from '.';

export default function EditRateForm({ 
  formData, setFormData,
  originalData, 
  formType,
  openRates, setOpenRates,
  rateErrMsgs
}){
  const emptyRate = {
    daily: null,
    event_parking_price: null,
    hourly: null,
    lot_end_time: "23:59:59",
    lot_start_time: "0:00:00",
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

  const addRate = () => {
    setFormData(prev => {
      const newRate = JSON.parse(JSON.stringify(emptyRate));
      newRate.rateNumber = formData.numRates;

      const newRates = formData.rates;
      newRates[newRate.rateNumber] = newRate;
      const newNumRates = formData.numRates + 1;
      return { ...prev, rates: newRates, numRates: newNumRates };
    });
  };

  const isModified = (rateObj, originalRateObj, field) =>{
    if(formType === 'add' || !rateObj || !originalRateObj) return false;
    return rateObj[field] !== originalRateObj[field];
  };

  const isRateModified = (rateObj, originalRateObj) => {
    const fields = [
      'daily', 'event_parking_price', 'hourly', 'lot_end_time', 'lot_start_time',
      'max_hours', 'monthly', 'permit_type', 'semesterly_fall_spring', 
      'semesterly_summer', 'sheet_number', 'sheet_price', 'yearly'
    ];
    const fieldModified = fields.some(field => isModified(rateObj, originalRateObj, field));
    const isNewRate = originalRateObj === undefined;
    
    return fieldModified || isNewRate;
  };

  const anyRateModified = () => {
    const originalRates = originalData.current.rates;
    //check for modifications or added rates
    for(const rate of Object.values(formData.rates)){
      if(isRateModified(rate, originalRates[rate.rateNumber]))
        return true;
    }

    // check for removed rates
    for(const rateNumber in originalRates){
      if(formData.rates[rateNumber] === undefined) return true;
    }
    return false;
  };
  return (<>
    <Collapsible 
      name={'Rates'} 
      className={'rates-collapsible'}
      wideCollapse
      startOpen={formType === 'add'}
      externalOpen={openRates} externalSetOpen={setOpenRates}
      asterisk={formType === 'add' || anyRateModified()} 
    >
      {/* debugging btn */}
      {/* <input type='button' onClick={() => console.log('rates:',formData.rates)} value={'See rates'}/> */}
      {Object.values(formData.rates).map(rate => (
        <EditRate 
          rateObj={rate} 
          key={rate.rateNumber} 
          formData={formData} setFormData={setFormData}
          originalRateObj={originalData.current.rates[rate.rateNumber]} //possibly undefined if new rate
          originalFormData={originalData.current}
          errorMsgs={rateErrMsgs[rate.rateNumber]}
          formType={formType}
          isModified={(field) => isModified(rate, originalData.current.rates[rate.rateNumber], field)} 
          isRateModified={() => isRateModified(rate, originalData.current.rates[rate.rateNumber])}
        />)
      )}
      {Object.keys(formData.rates).length === 0 && (
        <div style={{margin: '8px 0 0'}}>No rates to this lot currently!</div>
      )}
      <button id='lot-modal-add-rate' type='button' onClick={addRate}>Add a Rate</button>
    </Collapsible>
  </>)
}