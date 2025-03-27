import React from 'react';

// The form displays user data passed as a prop (`userData`) in a read-only format.
export default function ProfileForm({ userData }) {
    return (
      <section className="profile-form">
        <h2>Edit Profile</h2>
        <form>
          {/* Email Address Field */}
          <label>Email Address*</label>
          <input type="email" value={userData.email} readOnly />
  
          <div className="form-row">
            {/* First Name Field */}
            <div>
              <label>First Name*</label>
              <input type="text" value={userData.firstName} readOnly />
            </div>
            {/* Last Name Field */}
            <div>
              <label>Last Name*</label>
              <input type="text" value={userData.lastName} readOnly />
            </div>
          </div>
  
          {/* Username Field */}
          <label>Username*</label>
          <input type="text" value={userData.username} readOnly />
  
          {/* Password Field (masked for security) */}
          <label>Password*</label>
          <input type="password" value="***************" readOnly />
  
          {/* Mobile Number Field */}
          <label>Mobile Number*</label>
          <input type="tel" value={userData.mobile} readOnly />
  
          <div className="form-row">
            {/* Driver License Number Field */}
            <div>
              <label>Driver License No.*</label>
              <input type="text" value={userData.dlNumber} readOnly />
            </div>
            {/* Driver License State Field */}
            <div>
              <label>DL State*</label>
              <input type="text" value={userData.dlState} readOnly />
            </div>
          </div>
  
          {/* Address Line 1 Field */}
          <label>Address Line No. 1*</label>
          <input type="text" value={userData.address} readOnly />
  
          <div className="form-row">
            {/* City Field */}
            <div>
              <label>City*</label>
              <input type="text" value={userData.city} readOnly />
            </div>
            {/* State/Region Field */}
            <div>
              <label>State/Region*</label>
              <input type="text" value={userData.state} readOnly />
            </div>
          </div>
  
          <div className="form-row">
            {/* Postal/Zip Code Field */}
            <div>
              <label>Postal/Zip Code*</label>
              <input type="text" value={userData.zip} readOnly />
            </div>
            {/* Country Field */}
            <div>
              <label>Country*</label>
              <input type="text" value={userData.country} readOnly />
            </div>
          </div>
        </form>
      </section>
    );
}