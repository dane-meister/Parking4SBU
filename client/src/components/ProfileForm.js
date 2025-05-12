import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Popup } from '../components';
import axios from 'axios';
import ChangePasswordModal from "../components/ChangePasswordModal";
// const HOST = "http://localhost:8000"
const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000";

// The form displays user data passed as a prop (`userData`) in a read-only format.
export default function ProfileForm({ userData }) {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMsg, setPopupMsg] = useState('');

  // keep track of # of modified fields
  const [modifiedFields, setModifiedFields] = useState(new Set());
  const [showPwdModal, setShowPwdModal] = useState(false);

  const [email, setEmail] = useState(userData.email);
  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [mobile, setMobile] = useState(userData.mobile);
  const [dlNumber, setDlNumber] = useState(userData.dlNumber);
  const [dlState, setDlState] = useState(userData.dlState);
  const [address, setAddress] = useState(userData.address);
  const [city, setCity] = useState(userData.city);
  const [state, setState] = useState(userData.state);
  const [zip, setZip] = useState(userData.zip);
  const [country, setCountry] = useState(userData.country);

  const emailErr = useRef(null);
  const firstNameErr = useRef(null);
  const lastNameErr = useRef(null);
  const mobileNumberErr = useRef(null);
  const licenseErr = useRef(null);
  const dlStateErr = useRef(null);
  const addressErr = useRef(null);
  const cityErr = useRef(null);
  const stateErr = useRef(null);
  const zipErr = useRef(null);
  const countryErr = useRef(null);

  const us_states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID",
    "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
    "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK",
    "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV",
    "WI", "WY"
  ];

  const handleEditProfileSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) {
      emailErr.current.innerHTML = 'Email cannot be empty!';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
      emailErr.current.innerHTML = 'Email must be valid!, ex: email@website.com';
    } else {
      emailErr.current.innerHTML = '';
    }

    firstNameErr.current.innerHTML = !firstName.trim()
      ? 'First name cannot be empty!'
      : '';

    lastNameErr.current.innerHTML = !lastName.trim()
      ? 'Last name cannot be empty!'
      : '';

    if (!mobile.trim()) {
      mobileNumberErr.current.innerHTML = 'Mobile number cannot be empty';
    } else if (!/^\d{10}$/.test(mobile.trim())) {
      mobileNumberErr.current.innerHTML = 'Mobile number must be a valid US 10 digit number';
    } else {
      mobileNumberErr.current.innerHTML = '';
    }

    licenseErr.current.innerHTML = !dlNumber.trim()
      ? 'License number cannot be empty!'
      : '';

    /* dlState is always valid, from a select */

    addressErr.current.innerHTML = !address.trim()
      ? 'Address cannot be empty!'
      : '';

    cityErr.current.innerHTML = !city.trim()
      ? 'City cannot be empty!'
      : '';

    stateErr.current.innerHTML = !state.trim()
      ? 'State/region cannot be empty!'
      : '';

    if (!zip.trim()) {
      zipErr.current.innerHTML = 'Zip code cannot be empty!';
    } else if (!/^\d{5}(?:[-\s]\d{4})?$/.test(zip.trim())) {
      zipErr.current.innerHTML = 'Zip code must be valid!';
    } else {
      zipErr.current.innerHTML = '';
    }

    countryErr.current.innerHTML = !country.trim()
      ? 'Country cannot be empty!'
      : '';

    let hadError = [emailErr, firstNameErr, lastNameErr, mobileNumberErr, licenseErr, dlStateErr, addressErr, cityErr, stateErr, zipErr, countryErr]
      .map(elem => elem.current.innerHTML)
      .some(innerHTML => innerHTML !== '');
    if (hadError) return;
    /* backend here */

    const hardcodedTuples = [
      [email, userData.email, 'Email Address'], [firstName, userData.firstName, 'First Name'], [lastName, userData.lastName, 'Last Name'],
      [mobile, userData.mobile, 'Mobile Number'], [dlNumber, userData.dlNumber, 'Driver License No.'], [dlState, userData.dlState, 'DL State'],
      [address, userData.address, 'Address Line No. 1'], [city, userData.city, 'City'], [state, userData.state, 'State/Region'], [zip, userData.zip, 'Postal/Zip Code'],
      [country, userData.country, 'Country']
    ];

    let differingFields = [];
    hardcodedTuples.map(tuple => {
      if (tuple[0] !== tuple[1]) {
        differingFields.push([tuple[2], tuple[0]]);
      }
    });

    if (differingFields.length === 0) {
      alert('No changes to update!');
      return;
    }

    setPopupMsg(differingFields);
    setPopupVisible(true);
  };

  const handleFieldChange = (current, original, inputId, labelId) => {
    const input = document.getElementById(inputId);
    const label = document.getElementById(labelId);

    if (current === original) {
      const newSet = new Set(modifiedFields);
      newSet.delete(inputId);
      setModifiedFields(newSet);

      input.classList.remove('profile-modified');
      label.classList.remove('profile-modified');
    } else {
      const newSet = new Set(modifiedFields);
      newSet.add(inputId);
      setModifiedFields(newSet);

      input.classList.add('profile-modified');
      label.classList.add('profile-modified');
    }
  }

  const handleEditConfirmation = () => {
    axios.put(`${HOST}/api/auth/edit-profile/${userData.user_id}`,
      {
        email,
        first_name: firstName,
        last_name: lastName,
        phone_number: mobile,
        driver_license_number: dlNumber,
        dl_state: dlState,
        address_line: address,
        city,
        state_region: state,
        postal_zip_code: zip,
        country
      },
      { withCredentials: true }
    )
      .then(() => {
        setPopupVisible(false);
        window.location.reload();
      })
      .catch(err => {
        console.error(err);
        setPopupVisible(err);
      })
  };

  const handleFieldReset = () => {
    setEmail(userData.email);
    handleFieldChange('', '', 'email', 'profile-email-lbl');
    setFirstName(userData.firstName);
    handleFieldChange('', '', 'firstName', 'profile-first-name-lbl');
    setLastName(userData.lastName);
    handleFieldChange('', '', 'lastName', 'profile-last-name-lbl');
    setMobile(userData.mobile);
    handleFieldChange('', '', 'tel', 'profile-tel-lbl');
    setDlNumber(userData.dlNumber);
    handleFieldChange('', '', 'driversLicenseNo', 'profile-license-lbl');
    setDlState(userData.dlState);
    handleFieldChange('', '', 'driversLicenseState', 'profile-dl-state-lbl');
    setAddress(userData.address);
    handleFieldChange('', '', 'addr1', 'profile-address-lbl');
    setCity(userData.city);
    handleFieldChange('', '', 'city', 'profile-city-lbl');
    setState(userData.state);
    handleFieldChange('', '', 'state', 'profile-state-lbl');
    setZip(userData.zip);
    handleFieldChange('', '', 'zipCode', 'profile-zip-lbl');
    setCountry(userData.country);
    handleFieldChange('', '', 'country', 'profile-country-lbl');

    setModifiedFields(new Set());
  }

  return (
    <section className="profile-form">
      <div className='hbox' style={{ justifyContent: 'space-between' }}>
        <h2 style={{ display: 'inline-block' }}>Edit Profile</h2>
        <img src='/images/reset.png' alt='reset fields icon'
          className={modifiedFields.size === 0 ? 'invisible-icon' : 'reset-icon'}
          style={{ height: '22px', margin: '23px 0 27px 0' }}
          onClick={handleFieldReset}
        />
      </div>
      <form onSubmit={handleEditProfileSubmit}>
        {/* Email Address Field */}
        <label htmlFor="email" id='profile-email-lbl'>Email Address</label>
        <input id="email" type="email" value={email} disabled={popupVisible}
          onChange={(e) => { setEmail(e.target.value); handleFieldChange(e.target.value, userData.email, 'email', 'profile-email-lbl'); }}
          autoComplete='email'
        />
        <p ref={emailErr} id='profile-email-err' className='profile-error'></p>

        <div className="form-row">
          {/* First Name Field */}
          <div>
            <label htmlFor='firstName' id='profile-first-name-lbl'>First Name</label>
            <input id='firstName' type="text" value={firstName} disabled={popupVisible}
              onChange={(e) => { setFirstName(e.target.value); handleFieldChange(e.target.value, userData.firstName, 'firstName', 'profile-first-name-lbl'); }}
            />
            <p ref={firstNameErr} id='profile-first-name-err' className='profile-error'></p>
          </div>
          {/* Last Name Field */}
          <div>
            <label htmlFor='lastName' id='profile-last-name-lbl'>Last Name</label>
            <input id='lastName' type="text" value={lastName} disabled={popupVisible}
              onChange={(e) => { setLastName(e.target.value); handleFieldChange(e.target.value, userData.lastName, 'lastName', 'profile-last-name-lbl'); }}
            />
            <p ref={lastNameErr} id='profile-last-name-err' className='profile-error'></p>
          </div>
        </div>

        {/* Mobile Number Field */}
        <label htmlFor='tel' id='profile-tel-lbl'>Mobile Number</label>
        <input id='tel' type="tel" value={mobile} disabled={popupVisible}
          onChange={(e) => { setMobile(e.target.value); handleFieldChange(e.target.value, userData.mobile, 'tel', 'profile-tel-lbl'); }}
          autoComplete='tel'
        />
        <p ref={mobileNumberErr} id='profile-mobile-number-err' className='profile-error'></p>

        <div className="form-row">
          {/* Driver License Number Field */}
          <div>
            <label htmlFor='driversLicenseNo' id='profile-license-lbl'>Driver License No.</label>
            <input id='driversLicenseNo' type="text" value={dlNumber} disabled={popupVisible}
              onChange={(e) => { setDlNumber(e.target.value); handleFieldChange(e.target.value, userData.dlNumber, 'driversLicenseNo', 'profile-license-lbl'); }}
            />
            <p ref={licenseErr} id='profile-license-err' className='profile-error'></p>
          </div>
          {/* Driver License State Field */}
          <div>
            <label htmlFor='driversLicenseState' id='profile-dl-state-lbl'>DL State</label>
            <select id='driversLicenseState' value={dlState} disabled={popupVisible}
              onChange={(e) => { setDlState(e.target.value); handleFieldChange(e.target.value, userData.dlState, 'driversLicenseState', 'profile-dl-state-lbl'); }}
            >
              {us_states.map((state, index) => <option key={index} value={state}>{state}</option>)}
            </select>
            <p ref={dlStateErr} id='profile-dl-state-err' className='profile-error'></p>
          </div>
        </div>

        {/* Address Line 1 Field */}
        <label htmlFor='addr1' id='profile-address-lbl'>Address Line No. 1</label>
        <input id='addr1' type="text" value={address} disabled={popupVisible}
          onChange={(e) => { setAddress(e.target.value); handleFieldChange(e.target.value, userData.address, 'addr1', 'profile-address-lbl'); }}
        />
        <p ref={addressErr} id='profile-address-err' className='profile-error'></p>

        <div className="form-row">
          {/* City Field */}
          <div>
            <label htmlFor='city' id='profile-city-lbl'>City</label>
            <input id='city' type="text" value={city} disabled={popupVisible}
              onChange={(e) => { setCity(e.target.value); handleFieldChange(e.target.value, userData.city, 'city', 'profile-city-lbl'); }}
            />
            <p ref={cityErr} id='profile-city-err' className='profile-error'></p>
          </div>
          {/* State/Region Field */}
          <div>
            <label htmlFor='state' id='profile-state-lbl'>State/Region</label>
            <input id='state' type="text" value={state} disabled={popupVisible}
              onChange={(e) => { setState(e.target.value); handleFieldChange(e.target.value, userData.state, 'state', 'profile-state-lbl'); }}
            />
            <p ref={stateErr} id='profile-state-err' className='profile-error'></p>
          </div>
        </div>

        <div className="form-row">
          {/* Postal/Zip Code Field */}
          <div>
            <label htmlFor='zipCode' id='profile-zip-lbl'>Postal/Zip Code</label>
            <input id='zipCode' type="text" value={zip} disabled={popupVisible}
              onChange={(e) => { setZip(e.target.value); handleFieldChange(e.target.value, userData.zip, 'zipCode', 'profile-zip-lbl'); }}
            />
            <p ref={zipErr} id='profile-zip-err' className='profile-error'></p>
          </div>
          {/* Country Field */}
          <div>
            <label htmlFor='country' id='profile-country-lbl'>Country</label>
            <input id='country' type="text" value={country} disabled={popupVisible}
              onChange={(e) => { setCountry(e.target.value); handleFieldChange(e.target.value, userData.country, 'country', 'profile-country-lbl'); }}
              autoComplete='country'
            />
            <p ref={countryErr} id='profile-country-err' className='profile-error'></p>
          </div>
        </div>
        <p
          style={{ margin: '0', marginTop: '-5px', fontSize: '13px', color: 'var(--gray)' }}
        >* edited fields</p>

        <div style={{ margin: "1rem 0" }}>
          <button
            type="button"
            className="profile-change-password"
            disabled={popupVisible}
            onClick={() => setShowPwdModal(true)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: 0,
              font: 'inherit',
              fontSize: '13px',
              // color: 'var(--primary)',   // or any color you like
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            Change Password
          </button>
        </div>

        {showPwdModal && (
          <ChangePasswordModal
            onClose={() => setShowPwdModal(false)}
          />
        )}

        <input className='profile-update-btn' type='submit' value='Update Profile' disabled={popupVisible} />
      </form>

      {popupVisible &&
        <Popup name='profile'
          closeFunction={() => setPopupVisible(false)}
          popupHeading={'Are you sure you want to edit the following fields?:'}
        >
          <div style={{ margin: '10px' }}>
            {popupMsg.map((tuple, index) => {
              return <div key={index}>
                <strong>{tuple[0]}</strong>: {tuple[1]}
              </div>
            })}
          </div>
          <div className='profile-popup-btns' style={{ display: 'flex', gap: '10px', margin: '0 10px' }}>
            <button
              autoFocus // eslint-disable-line jsx-a11y/no-autofocus
              onClick={() => setPopupVisible(false)}
            >Cancel</button>
            <button
              onClick={handleEditConfirmation}
            >Confirm Edits</button>
          </div>
        </Popup>
      }

    </section>
  );
}