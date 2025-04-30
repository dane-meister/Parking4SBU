import { useState } from "react";

const DisableableInput = (props) => {
  const { value, onChange, inputId, inputName, isMoney, isInt, onDisable } = props;
  const [disabled, setDisabled] = useState(props.disabled ?? false)

  const onKeyDown = (e) => {
    const allowedKeys = [
      'Backspace', 'Delete', 
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Tab', 'Home', 'End'
    ];
    
    if (allowedKeys.includes(e.key)) {
      return; // Allow these keys to work normally
    }

    if(
      (isMoney && e.key.match(/[^0-9.]/)) ||
      (isMoney && e.key == '.' && e.target.value.match(/[^.]*\.[^.]*/)) ||
      (isInt && e.key.match(/[^0-9]/))
    ){
      e.preventDefault();
      return;
    }
  };

  return (
    <div className='disableable-input flex' disabled={disabled}>
      {isMoney && !disabled && (
        <div style={{paddingTop: '1px', marginLeft: '2px', fontSize: '12px', height: '19px'}}>$</div>
      )}
      <input 
        id={inputId ?? ''} 
        autoComplete='off' 
        value={value} 
        disabled={disabled}
        name={inputName}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <button onClick={() => {setDisabled(!disabled); onDisable()}}>
        <img src='/images/disable.png' alt='disable' />
      </button>
    </div>
  );
};

export default DisableableInput;