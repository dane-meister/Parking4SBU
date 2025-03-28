import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../stylesheets/Auth.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userType: '',
    permitType: '',
    dlNumber: '',
    dlState: '',
    address: '',
    city: '',
    stateRegion: '',
    zip: '',
    country: '',
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const next = () => {
    if (step === 1 && form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    setStep(prev => prev + 1);
  };

  const back = () => {
    setStep(prev => prev - 1);
  };

  const handleRegister = e => {
    e.preventDefault();
    // Replace with actual registration logic
    console.log('User registered:', form);
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>
        <form onSubmit={handleRegister} className="auth-form">
          {step === 1 && (
            <>
              <div className="form-row">
                <div>
                  <label htmlFor="firstName">First Name</label>
                  <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="lastName">Last Name</label>
                  <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required />
                </div>
              </div>

              <label htmlFor="email">Email</label>
              <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required />

              <label htmlFor="password">Password</label>
              <input id="password" type="password" name="password" value={form.password} onChange={handleChange} required />

              <label htmlFor="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />

              <label htmlFor="phone">Phone Number</label>
              <input id="phone" type="tel" name="phone" value={form.phone} onChange={handleChange} required />
            </>
          )}

          {step === 2 && (
            <>
              <label htmlFor="userType">User Type</label>
              <select id="userType" name="userType" value={form.userType} onChange={handleChange} required>
                <option value="">Select Type</option>
                <option value="commuter">Commuter</option>
                <option value="resident">Resident</option>
                <option value="faculty">Faculty</option>
                <option value="visitor">Visitor</option>
              </select>

              {form.userType !== 'visitor' && (
                <>
                  <label htmlFor="permitType">Permit Type</label>
                  <select id="permitType" name="permitType" value={form.permitType} onChange={handleChange} required>
                    <option value="">Select Permit</option>
                    <option value="core">Core</option>
                    <option value="perimeter">Perimeter</option>
                    <option value="satellite">Satellite</option>
                    <option value="faculty">Faculty</option>
                    <option value="resident">Resident</option>
                  </select>
                </>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <label htmlFor="dlNumber">Driver License Number</label>
              <input id="dlNumber" name="dlNumber" value={form.dlNumber} onChange={handleChange} required />

              <label htmlFor="dlState">DL State</label>
              <input id="dlState" name="dlState" value={form.dlState} onChange={handleChange} required />

              <label htmlFor="address">Address</label>
              <input id="address" name="address" value={form.address} onChange={handleChange} required />

              <div className="form-row">
                <div>
                  <label htmlFor="city">City</label>
                  <input id="city" name="city" value={form.city} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="stateRegion">State/Region</label>
                  <input id="stateRegion" name="stateRegion" value={form.stateRegion} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label htmlFor="zip">Zip Code</label>
                  <input id="zip" name="zip" value={form.zip} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="country">Country</label>
                  <input id="country" name="country" value={form.country} onChange={handleChange} required />
                </div>
              </div>
            </>
          )}

          <div className="auth-buttons">
            {step > 1 && <button type="button" className="auth-button secondary" onClick={back}>Back</button>}
            {step < 3 && <button type="button" className="auth-button" onClick={next}>Next</button>}
            {step === 3 && <button type="submit" className="auth-button">Register</button>}
          </div>
        </form>
      </div>
    </div>
  );
}