import React, { useState } from 'react';
import '../stylesheets/Popup.css';
 

export default function Popup({ children, closeFunction, name, popupHeading}){
  return (<section className={`popup-overlay ${!!name ? name + '-popup-overlay' : ''}`} onClick={closeFunction} >
    <section className='dim' />
    <section className={`popup ${!!name ? name + '-popup' : ''}`} onClick={(e) => e.stopPropagation()}>
      <div className='hbox'>
        <span className={`popup-heading ${!!name ? name + '-popup-heading' : ''}`}>{popupHeading ?? 'Popup'}</span>
        <span className='flex'/>
        <img 
          className='close-icon' 
          src='/images/x.png' 
          alt='close'
          onClick={closeFunction}
        />
      </div>
      {children}
    </section>
  </section>); 
}