import  React, { useState } from 'react';
import { Link } from 'react-router-dom';
// The form displays user data passed as a prop (`userData`) in a read-only format.
export default function ProfileForm({ userData }) {
  const [ email, setEmail ] = useState(userData.email);
  const [ firstName, setFirstName ] = useState(userData.firstName);
  const [ lastName, setLastName ] = useState(userData.lastName);
  const [ mobile, setMobile ] = useState(userData.mobile);
  const [ dlNumber, setDlNumber ] = useState(userData.dlNumber);
  const [ dlState, setDlState ] = useState(userData.dlState);
  const [ address, setAddress ] = useState(userData.address);
  const [ city, setCity ] = useState(userData.city);
  const [ state, setState ] = useState(userData.state);
  const [ zip, setZip ] = useState(userData.zip);
  const [ country, setCountry ] = useState(userData.country);

  const emailErr = document.getElementById('profile-email-err');      
  const firstNameErr = document.getElementById('profile-first-name-err');
  const lastNameErr = document.getElementById('profile-last-name-err');
  const mobileNumberErr = document.getElementById('profile-mobile-number-err');
  const licenseErr = document.getElementById('profile-license-err');
  const dlStateErr = document.getElementById('profile-dl-state-err');
  const addressErr = document.getElementById('profile-address-err');
  const cityErr = document.getElementById('profile-city-err');
  const stateErr = document.getElementById('profile-state-err');
  const zipErr = document.getElementById('profile-zip-err');
  const countryErr = document.getElementById('profile-country-err');

  const us_states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID",
    "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
    "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK",
    "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV",
    "WI", "WY"
  ];

  const handleEditProfileSubmit = (event) => {
    event.preventDefault();
    if(!email.trim()){
      emailErr.innerHTML = 'Email cannot be empty!';
    }else if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())){
      emailErr.innerHTML = 'Email must be valid!, ex: email@website.com';
    }else{
      emailErr.innerHTML = '';
    }

    firstNameErr.innerHTML = !firstName.trim()
      ? 'First name cannot be empty!'
      : '';

    lastNameErr.innerHTML = !lastName.trim()
      ? 'Last name cannot be empty!'
      : '';

    if(!mobile.trim()){
      mobileNumberErr.innerHTML = 'Mobile number cannot be empty';
    }else if(!/^\d{10}$/.test(mobile.trim())){
      mobileNumberErr.innerHTML = 'Mobile number must be a valid US 10 digit number';
    }else{
      console.log('hi');
      mobileNumberErr.innerHTML = '';
    }

    licenseErr.innerHTML = !dlNumber.trim()
      ? 'License number cannot be empty!'
      : '';

    /* dlState is always valid, from a select */

    addressErr.innerHTML = !address.trim()
      ? 'Address cannot be empty!'
      : '';

    cityErr.innerHTML = !city.trim()
      ? 'City cannot be empty!'
      : '';

    stateErr.innerHTML = !state.trim()
      ? 'State/region cannot be empty!'
      : '';

    if(!zip.trim()){
      zipErr.innerHTML = 'Zip code cannot be empty!';
    }else if(!/^\d{5}(?:[-\s]\d{4})?$/.test(zip.trim())){
      zipErr.innerHTML = 'Zip code must be valid!';
    }else{
      zipErr.innerHTML = '';
    }

    countryErr.innerHTML = !country.trim()
      ? 'Country cannot be empty!'
      : '';

    let hadError = [emailErr, firstNameErr, lastNameErr, mobileNumberErr, licenseErr, dlStateErr, addressErr, cityErr, stateErr, zipErr, countryErr]
      .map(elem => elem.innerHTML)
      .some(innerHTML => innerHTML !== '');
    if(hadError) return;
    /* backend here */
    const hardcodedTuples = [
      [email, userData.email, 'Email Address'], [firstName, userData.firstName, 'First Name'], [lastName, userData.lastName, 'Last Name'],
      [mobile, userData.mobile, 'Mobile Number'], [dlNumber, userData.dlNumber, 'Driver License No.'], [dlState, userData.dlState, 'DL State'],
      [address, userData.address, 'Address Line No. 1'], [city, userData.city, 'City'], [state, userData.state, 'State/Region'], [zip, userData.zip, 'Postal/Zip Code'],
      [country, userData.country, 'Country']
    ];

    let differingFields = [];
    hardcodedTuples.map(tuple => {
      if(tuple[0] !== tuple[1]){
        differingFields.push(`${tuple[2]}: ${tuple[0]}`);
      }
    });
    alert("Are you sure you want to modify these fields?:\n"+differingFields.join('\n'));
  };

  const handleFieldChange = (current, original, inputId, labelId) => {
    const input = document.getElementById(inputId);
    const label = document.getElementById(labelId);
    if(current === original){
      input.classList.remove('profile-modified');
      label.classList.remove('profile-modified');
    }else{
      input.classList.add('profile-modified');
      label.classList.add('profile-modified');
    }
  }

  return (
    <section className="profile-form">
      <h2>Edit Profile</h2>
      <form onSubmit={handleEditProfileSubmit}>
        {/* Email Address Field */}
        <label htmlFor="email" id='profile-email-lbl'>Email Address</label>
        <input id="email" type="email" value={email} 
          onChange={(e) => { setEmail(e.target.value); handleFieldChange(e.target.value, userData.email, 'email', 'profile-email-lbl'); }}
        />
        <p id='profile-email-err' className='profile-error'></p>
        
        <div className="form-row">
          {/* First Name Field */}
          <div>
            <label htmlFor='firstName' id='profile-first-name-lbl'>First Name</label>
            <input id='firstName' type="text" value={firstName} 
              onChange={(e) => { setFirstName(e.target.value); handleFieldChange(e.target.value, userData.firstName, 'firstName', 'profile-first-name-lbl'); }}
            />
            <p id='profile-first-name-err' className='profile-error'></p>
          </div>
          {/* Last Name Field */}
          <div>
            <label htmlFor='lastName' id='profile-last-name-lbl'>Last Name</label>
            <input id='lastName' type="text" value={lastName} 
              onChange={(e) => { setLastName(e.target.value); handleFieldChange(e.target.value, userData.lastName, 'lastName', 'profile-last-name-lbl'); }}
            />
            <p id='profile-last-name-err' className='profile-error'></p>
          </div>
        </div>

        {/* Mobile Number Field */}
        <label htmlFor='tel' id='profile-tel-lbl'>Mobile Number</label>
        <input id='tel' type="tel" value={mobile} 
          onChange={(e) => { setMobile(e.target.value); handleFieldChange(e.target.value, userData.mobile, 'tel', 'profile-tel-lbl'); }}
        />
        <p id='profile-mobile-number-err' className='profile-error'></p>

        <div className="form-row">
          {/* Driver License Number Field */}
          <div>
            <label htmlFor='driversLicenseNo' id='profile-license-lbl'>Driver License No.</label>
            <input id='driversLicenseNo' type="text" value={dlNumber} 
              onChange={(e) => { setDlNumber(e.target.value); handleFieldChange(e.target.value, userData.dlNumber, 'driversLicenseNo', 'profile-license-lbl'); }}
            />
            <p id='profile-license-err' className='profile-error'></p>
          </div>
          {/* Driver License State Field */}
          {/* <div> */}
          {/*   <label htmlFor='driversLicenseState' id='profile-dl-state-lbl'>DL State</label> */}
          {/*   <input id='driversLicenseState' type="text" value={dlState}  */}
          {/*     onChange={(e) => { setDlState(e.target.value); handleFieldChange(e.target.value, userData.dlState, 'driversLicenseState', 'profile-dl-state-lbl'); }} */}
          {/*   /> */}
          {/*   <p id='profile-dl-state-err' className='profile-error'></p> */}
          {/* </div> */}
          <div>
            <label htmlFor='driversLicenseState' id='profile-dl-state-lbl'>DL State</label>
            <select id='driversLicenseState' value={dlState} 
              onChange={(e) => { setDlState(e.target.value); handleFieldChange(e.target.value, userData.dlState, 'driversLicenseState', 'profile-dl-state-lbl'); }}
            >
              {us_states.map((state, index) => <option value={state}>{state}</option>)}
            </select>
            <p id='profile-dl-state-err' className='profile-error'></p>
          </div>
        </div>

        {/* Address Line 1 Field */}
        <label htmlFor='addr1' id='profile-address-lbl'>Address Line No. 1</label>
        <input id='addr1' type="text" value={address} 
          onChange={(e) => { setAddress(e.target.value); handleFieldChange(e.target.value, userData.address, 'addr1', 'profile-address-lbl'); }}
        />
        <p id='profile-address-err' className='profile-error'></p>

        <div className="form-row">
          {/* City Field */}
          <div>
            <label htmlFor='city' id='profile-city-lbl'>City</label>
            <input id='city' type="text" value={city} 
              onChange={(e) => { setCity(e.target.value); handleFieldChange(e.target.value, userData.city, 'city', 'profile-city-lbl'); }}
            />
            <p id='profile-city-err' className='profile-error'></p>
          </div>
          {/* State/Region Field */}
          <div>
            <label htmlFor='state' id='profile-state-lbl'>State/Region</label>
            <input id='state' type="text" value={state} 
              onChange={(e) => { setState(e.target.value); handleFieldChange(e.target.value, userData.state, 'state', 'profile-state-lbl'); }}
            />
            <p id='profile-state-err' className='profile-error'></p>
          </div>
        </div>

        <div className="form-row">
          {/* Postal/Zip Code Field */}
          <div>
            <label htmlFor='zipCode' id='profile-zip-lbl'>Postal/Zip Code</label>
            <input id='zipCode' type="text" value={zip} 
              onChange={(e) => { setZip(e.target.value); handleFieldChange(e.target.value, userData.zip, 'zipCode', 'profile-zip-lbl'); }}
            />
            <p id='profile-zip-err' className='profile-error'></p>
          </div>
          {/* Country Field */}
          <div>
            <label htmlFor='country' id='profile-country-lbl'>Country</label>
            <input id='country' type="text" value={country} 
              onChange={(e) => { setCountry(e.target.value); handleFieldChange(e.target.value, userData.country, 'country', 'profile-country-lbl'); }}
            />
            <p id='profile-country-err' className='profile-error'></p>
          </div>
        </div>
        <p
          style={{margin: '0', marginTop: '-5px', fontSize: '13px', color: 'var(--gray)'}}
        >* edited fields</p>
        <Link className="profile-change-password">Change Password</Link>
        <input className='profile-update-btn' type='submit' value='Update Profile' />
      </form>
    </section>
  );
}