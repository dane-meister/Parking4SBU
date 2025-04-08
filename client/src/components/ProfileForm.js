import React from 'react';
import { Link } from 'react-router-dom';
// The form displays user data passed as a prop (`userData`) in a read-only format.
export default function ProfileForm({ userData }) {
    return (
      <section className="profile-form">
        <h2>Edit Profile</h2>
        <form>
          {/* Email Address Field */}
          <label htmlFor="email">Email Address*</label>
          <input id="email" type="email" value={userData.email} readOnly />
  
          <div className="form-row">
            {/* First Name Field */}
            <div>
              <label htmlFor='firstName'>First Name*</label>
              <input id='firstName' type="text" value={userData.firstName} readOnly />
            </div>
            {/* Last Name Field */}
            <div>
              <label htmlFor='lastName'>Last Name*</label>
              <input id='lastName' type="text" value={userData.lastName} readOnly />
            </div>
          </div>
  
          {/* Password Field (masked for security) */}
          {/* <label htmlFor='password'>Password*</label>
          <input id="password" type='password' value="***************" readOnly /> */}
  
          {/* Mobile Number Field */}
          <label htmlFor='tel'>Mobile Number*</label>
          <input id='tel' type="tel" value={userData.mobile} readOnly />
  
          <div className="form-row">
            {/* Driver License Number Field */}
            <div>
              <label htmlFor='drivesLicenseNo'>Driver License No.*</label>
              <input id='drivesLicenseNo' type="text" value={userData.dlNumber} readOnly />
            </div>
            {/* Driver License State Field */}
            <div>
              <label htmlFor='driversLicenseState'>DL State*</label>
              <input id='driversLicenseState' type="text" value={userData.dlState} readOnly />
            </div>
          </div>
  
          {/* Address Line 1 Field */}
          <label htmlFor='addr1'>Address Line No. 1*</label>
          <input id='addr1' type="text" value={userData.address} readOnly />
  
          <div className="form-row">
            {/* City Field */}
            <div>
              <label htmlFor='city'>City*</label>
              <input id='city' type="text" value={userData.city} readOnly />
            </div>
            {/* State/Region Field */}
            <div>
              <label htmlFor='state'>State/Region*</label>
              <input id='state' type="text" value={userData.state} readOnly />
            </div>
          </div>
  
          <div className="form-row">
            {/* Postal/Zip Code Field */}
            <div>
              <label htmlFor='zipCode'>Postal/Zip Code*</label>
              <input id='zipCode' type="text" value={userData.zip} readOnly />
            </div>
            {/* Country Field */}
            <div>
              <label htmlFor='country'>Country*</label>
              <input id='country' type="text" value={userData.country} readOnly />
            </div>
          </div>
          <Link className="profile-change-password">Change Password</Link>
          <input className='profile-update-btn' type='submit' value='Update Profile' />
        </form>
      </section>
    );
}