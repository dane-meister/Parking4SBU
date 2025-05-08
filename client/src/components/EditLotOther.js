import { useState } from "react";
import { Collapsible, DisableableInput } from ".";

export default function EditLotOther({
  formData, setFormData,
  originalData,
  formType,
  openOther, setOpenOther,
  otherErrs
}){
  
  const [isChecked, setIsChecked] = useState(formData.covered);
  const anyOtherModified = () => {
    return isModified('covered') || isModified('resident_zone');
  };

  const handleCoveredClick = (e) => {
    setIsChecked(e.target.checked);
    setFormData(prev => ({ ...prev, covered: e.target.checked }));
  };

  const onResidentZoneChange = (e) => {
    setFormData(prev => {
      const newResidentZone = e.target.value;
      return { ...prev, resident_zone: newResidentZone } ;
    });
  };

  const onResidentZoneDisable = () => {
    setFormData(prev => {
      const newResidentZone = formData.resident_zone === null ? '' : null;
      return { ...prev, resident_zone: newResidentZone} ;
    });
  };

  const isModified = (field) => formData[field] !== originalData.current[field];
  return (<>
    <Collapsible 
      name={'Other'} 
      className={'other-collapsible'}
      wideCollapse
      persistentChildren
      startOpen={formType === 'add'}
      externalOpen={openOther} externalSetOpen={setOpenOther}
      asterisk={formType === 'add' || anyOtherModified()} 
    >
      {console.log(`isModified: ${isModified('covered')}`)}
      <div className="hbox" style={{marginBottom: '5px'}}>
        <label htmlFor="covered" style={{width: '70px'}}>
          Covered{isModified('covered') && '*'}: 
        </label>
        <input type="checkbox" id='covered'
          checked={isChecked}
          onChange={handleCoveredClick}
        />
      </div>

      <div className="hbox lot-resident-zone-box" style={{gap: '5px'}}>
        <DisableableInput 
          value={formData.resident_zone ?? ''} 
          inputId={`resident_zone`}
          inputName='resident_zone'
          disabled={formData.resident_zone === null}
          onChange={onResidentZoneChange}
          onDisable={onResidentZoneDisable}
          isModified={isModified('resident_zone')}
          label='Resident Zone'
        />
      </div>
      <div className='lot-form-error' ref={otherErrs} />
    </Collapsible>
  </>);
}
