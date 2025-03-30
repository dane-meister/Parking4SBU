import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../stylesheets/Auth.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone_number: '',
    user_type: '',
    permit_type: '',
    driver_license_number: '',
    dl_state: '',
    address_line: '',
    city: '',
    state_region: '',
    postal_zip_code: '',
    country: '',
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isStepValid = () => {
    if (step === 1) {
      return (
        form.first_name &&
        form.last_name &&
        form.email &&
        form.password &&
        form.confirm_password &&
        form.phone_number &&
        form.password === form.confirm_password
      );
    }
    if (step === 2) {
      if (!form.user_type) return false;
      if (form.user_type !== 'visitor' && !form.permit_type) return false;
      return true;
    }
    if (step === 3) {
      return (
        form.driver_license_number &&
        form.dl_state &&
        form.address &&
        form.city &&
        form.state_region &&
        form.postal_zip_code &&
        form.country
      );
    }
    return false;
  };
  
  const next = () => {
    if (!isStepValid()) {
      alert("Please complete all required fields before proceeding.");
      return;
    }
    setStep(prev => prev + 1);
  };
  

  const back = () => {
    setStep(prev => prev - 1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    try {
      // Send a POST request to the registration endpoint
      const response = await axios.post('http://localhost:8000/api/auth/register', form);
      console.log("Registration response:", response.data);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleRegister} className="auth-form">
          {step === 1 && (
            <>
              <div className="form-row">
                <div>
                <label htmlFor="first_name">First Name</label>
                  <input 
                    id="first_name" 
                    name="first_name" 
                    value={form.first_name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div>
                <label htmlFor="last_name">Last Name</label>
                  <input 
                    id="last_name" 
                    name="last_name" 
                    value={form.last_name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <label htmlFor="email">Email Address</label>
              <input 
                id="email" 
                type="email" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                required 
              />

              <label htmlFor="password">Password</label>
              <input 
                id="password" 
                type="password" 
                name="password" 
                value={form.password} 
                onChange={handleChange} 
                required 
              />

              <label htmlFor="confirm_password">Confirm Password</label>
              <input 
                id="confirm_password" 
                type="password" 
                name="confirm_password" 
                value={form.confirm_password} 
                onChange={handleChange} 
                required 
              />

              <label htmlFor="phone_number">Phone Number</label>
              <input 
                id="phone_number" 
                type="tel" 
                name="phone_number" 
                value={form.phone_number} 
                onChange={handleChange} 
                required 
              />
            </>
          )}

          {step === 2 && (
            <>
              <label htmlFor="user_type">User Type</label>
              <select 
                id="user_type" 
                name="user_type" 
                value={form.user_type} 
                onChange={handleChange} 
                required
              >
                <option value="">Select Type</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="staff">Staff</option>
                <option value="visitor">Visitor</option>
                <option value="admin">Admin</option>
              </select>

              {form.user_type !== 'visitor' && (
                <>
                  <label htmlFor="permit_type">Permit Type</label>
                  <select 
                    id="permit_type" 
                    name="permit_type" 
                    value={form.permit_type} 
                    onChange={handleChange} 
                    required
                  >
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
              <label htmlFor="driver_license_number">Driver License Number</label>
              <input 
                id="driver_license_number" 
                name="driver_license_number" 
                value={form.driver_license_number} 
                onChange={handleChange} 
                required 
              />

              <label htmlFor="dl_state">Driver License State</label>
              <input 
                id="dl_state" 
                name="dl_state" 
                value={form.dl_state} 
                onChange={handleChange} 
                required 
              />


              <label htmlFor="address_line">Address</label>
              <input 
                id="address_line" 
                name="address_line" 
                value={form.address_line} 
                onChange={handleChange} 
                required 
              />


              <div className="form-row">
                <div>
                <label htmlFor="city">City</label>
                  <input 
                    id="city" 
                    name="city" 
                    value={form.city} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div>
                <label htmlFor="state_region">State/Region</label>
                  <input 
                    id="state_region" 
                    name="state_region" 
                    value={form.state_region} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div>
                <label htmlFor="postal_zip_code">Zip Code</label>
                  <input 
                    id="postal_zip_code" 
                    name="postal_zip_code" 
                    value={form.postal_zip_code} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div>
                <label htmlFor="country">Country</label>
                  <input 
                    id="country" 
                    name="country" 
                    value={form.country} 
                    onChange={handleChange} 
                    required 
                  />
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