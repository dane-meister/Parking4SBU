import React from 'react';

export default function ProfileForm({ userData }) {
    return (
      <section className="profile-form">
        <h2>Edit Profile</h2>
        <form>
          <label>Email Address*</label>
          <input type="email" value={userData.email} readOnly />
  
          <div className="form-row">
            <div>
              <label>First Name*</label>
              <input type="text" value={userData.firstName} readOnly />
            </div>
            <div>
              <label>Last Name*</label>
              <input type="text" value={userData.lastName} readOnly />
            </div>
          </div>
  
          <label>Username*</label>
          <input type="text" value={userData.username} readOnly />
  
          <label>Password*</label>
          <input type="password" value="***************" readOnly />
  
          <label>Mobile Number*</label>
          <input type="tel" value={userData.mobile} readOnly />
  
          <div className="form-row">
            <div>
              <label>Driver License No.*</label>
              <input type="text" value={userData.dlNumber} readOnly />
            </div>
            <div>
              <label>DL State*</label>
              <input type="text" value={userData.dlState} readOnly />
            </div>
          </div>
  
          <label>Address Line No. 1*</label>
          <input type="text" value={userData.address} readOnly />
  
          <div className="form-row">
            <div>
              <label>City*</label>
              <input type="text" value={userData.city} readOnly />
            </div>
            <div>
              <label>State/Region*</label>
              <input type="text" value={userData.state} readOnly />
            </div>
          </div>
  
          <div className="form-row">
            <div>
              <label>Postal/Zip Code*</label>
              <input type="text" value={userData.zip} readOnly />
            </div>
            <div>
              <label>Country*</label>
              <input type="text" value={userData.country} readOnly />
            </div>
          </div>
        </form>
      </section>
    );
  }