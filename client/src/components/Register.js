import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../stylesheets/Auth.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Tracks the current step in the multi-step form
  const [error, setError] = useState(''); // Stores error messages
  const [passwordMatchMessage, setPasswordMatchMessage] = useState(''); // Message for password match validation
  const [dlNumberError, setDlNumberError] = useState(''); // Placeholder for driver's license number validation errors

  // Form state to store user input
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

  // List of US states for driver's license state dropdown
  const us_states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID",
    "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
    "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK",
    "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV",
    "WI", "WY"
  ];

  // List of countries for the country dropdown
  const countries = ["USA", "Canada", "Mexico", "UK", "Other"];

  // Handles changes to form inputs and updates the state
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Dynamically checks if passwords match and updates the message
  useEffect(() => {
    if (form.confirm_password) {
      if (form.password === form.confirm_password) {
        setPasswordMatchMessage("Passwords match");
      } else {
        setPasswordMatchMessage("Passwords do not match");
      }
    } else {
      setPasswordMatchMessage("");
    }
  }, [form.password, form.confirm_password]);

  // Validates the current step of the form
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
        form.address_line &&
        form.city &&
        form.state_region &&
        form.postal_zip_code &&
        form.country
      );
    }
    return false;
  };

  // Moves to the next step if the current step is valid
  const next = () => {
    if (!isStepValid()) {
      alert("Please complete all required fields before proceeding.");
      return;
    }
    setStep(prev => prev + 1);
  };

  // Moves back to the previous step
  const back = () => {
    setStep(prev => prev - 1);
  };

  // Handles the registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    try {
      // Sends a POST request to the registration endpoint
      const response = await axios.post('http://localhost:8000/api/auth/register', form, {
        withCredentials: true
      });
      console.log("Registration response:", response.data);
      navigate('/login'); // Redirects to the login page upon successful registration
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
          {/* Step 1: Basic Information */}
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

              <label htmlFor="password" style={{ marginTop: '16px' }}>Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <label htmlFor="confirm_password" style={{ marginTop: '16px' }}>Confirm Password</label>
              <input
                id="confirm_password"
                type="password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                required
              />
              {passwordMatchMessage && (
                <span
                  className={`password-match ${passwordMatchMessage === "Passwords match" ? "valid" : "invalid"}`}
                >
                  {passwordMatchMessage}
                </span>
              )}

              <label htmlFor="phone_number" style={{ marginTop: '16px' }}>Phone Number</label>
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

          {/* Step 2: User Type and Permit Selection */}
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
                <option value="faculty">Faculty</option>
                <option value="resident">Resident</option>
                <option value="commuter">Commuter</option>
                <option value="visitor">Visitor</option>
                <option value="admin">Admin</option> {/* Admin option to be removed later */}
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
                    {form.user_type === 'faculty' && (
                      <>
                        <option value="faculty">Faculty</option>
                        <option value="faculty-life-sciences-1">Faculty Life Sciences 1</option>
                        <option value="faculty-life-sciences-2">Faculty Life Sciences 2</option>
                        <option value="faculty-garage-gated-1">Faculty Garage/Gated: CSEA/UUP/PEF/PBA/NUSCOPBA</option>
                        <option value="faculty-garage-gated-2">Faculty Garage/Gated: GSEU/MC/Research</option>
                        <option value="premium">Premium</option>
                      </>
                    )}
                    {form.user_type === 'resident' && (
                      <>
                        <option value="resident-zone1">Resident Zone 1</option>
                        <option value="resident-zone2">Resident Zone 2</option>
                        <option value="resident-zone3">Resident Zone 3</option>
                        <option value="resident-zone4">Resident Zone 4</option>
                        <option value="resident-zone5">Resident Zone 5</option>
                        <option value="resident-zone6">Resident Zone 6</option>
                      </>
                    )}
                    {form.user_type === 'commuter' && (
                      <>
                        <option value="core">Core</option>
                        <option value="perimeter">Perimeter</option>
                        <option value="satellite">Satellite</option>
                      </>
                    )}
                    {form.user_type === 'admin' && (
                      <>
                      {/* Just so admin has a permit type */}
                        <option value="core">Core</option>
                        <option value="perimeter">Perimeter</option>
                        <option value="satellite">Satellite</option>
                      </>
                    )}
                  </select>
                </>
              )}
            </>
          )}

          {/* Step 3: Address and Driver's License Information */}
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

              <label htmlFor="dl_state" style={{ marginTop: '16px' }}>Driver License State</label>
              <select
                id="dl_state"
                name="dl_state"
                value={form.dl_state}
                onChange={handleChange}
                required
              >
                <option value="">Select State</option>
                {us_states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>

              <label htmlFor="address_line">Address</label>
              <input
                id="address_line"
                name="address_line"
                value={form.address_line}
                onChange={handleChange}
                required
              />

              <div className="form-row" style={{ marginTop: '16px' }}>
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