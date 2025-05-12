import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../stylesheets/Auth.css';
// const HOST = "http://localhost:8000"
const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000"; // Base URL for API requests

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Tracks the current step in the multi-step form
  const [error, setError] = useState(''); // Stores error messages
  const [passwordMatchMessage, setPasswordMatchMessage] = useState(''); // Message for password match validation
  const [isRegistering, setIsRegistering] = useState(false); // Flag to indicate if the user is registering (clicked button)
  const [isRegistered, setIsRegistered] = useState(false); // Flag to indicate if the user is registered

  const [errors, setErrors] = useState({});


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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  
    // Clear field-specific error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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
  const validateStep = () => {
    const newErrors = {};
  
    if (step === 1) {
      if (!form.first_name) newErrors.first_name = "First name is required";
      if (!form.last_name) newErrors.last_name = "Last name is required";
      if (!form.email) newErrors.email = "Email is required";
      if (!form.password) newErrors.password = "Password is required";
      if (!form.confirm_password) newErrors.confirm_password = "Confirm your password";
      else if (form.password !== form.confirm_password) {
        newErrors.confirm_password = "Passwords do not match";
      }
      if (!form.phone_number) newErrors.phone_number = "Phone number is required";
    }
  
    if (step === 2) {
      if (!form.user_type) newErrors.user_type = "Select a user type";
      if (!form.permit_type) {
        newErrors.permit_type = "Select a permit type";
      }
    }
  
    if (step === 3) {
      if (!form.driver_license_number) newErrors.driver_license_number = "Driver's license number is required";
      if (!form.dl_state) newErrors.dl_state = "Select a license state";
      if (!form.address_line) newErrors.address_line = "Address is required";
      if (!form.city) newErrors.city = "City is required";
      if (!form.state_region) newErrors.state_region = "State/Region is required";
      if (!form.postal_zip_code) newErrors.postal_zip_code = "Zip code is required";
      if (!form.country) newErrors.country = "Country is required";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  // Moves to the next step if the current step is valid
  const next = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  // Moves back to the previous step
  const back = () => {
    setStep(prev => prev - 1);
  };

  const [awaitingApproval, setAwaitingApproval] = useState(false);
  useEffect(() => {
    if (isRegistered && !awaitingApproval) {
      const timer = setTimeout(() => {
        navigate('/auth/login');
      }, 2000); // 5 seconds
  
      return () => clearTimeout(timer);
    }
  }, [isRegistered, navigate, awaitingApproval]);

  // Handles the registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateStep()) return
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setIsRegistering(true); // Set the registration flag to true
      // Sends a POST request to the registration endpoint
      const response = await axios.post(`${HOST}/api/auth/register`, form, {
        withCredentials: true
      });
      setAwaitingApproval(true); // Set the awaiting approval flag to true
      setIsRegistered(true); // Set the registration flag to true
    } catch (err) {
      setIsRegistering(false); // Reset the registration flag on error
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
                    autoComplete='given-name'
                  />
                  {errors.first_name && <span className="field-error">{errors.first_name}</span>}
                </div>
                <div>
                  <label htmlFor="last_name">Last Name</label>
                  <input
                    id="last_name"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                    autoComplete='family-name'
                  />
                  {errors.last_name && <span className="field-error">{errors.last_name}</span>}
                </div>
              </div>

              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email.toLowerCase()}
                onChange={handleChange}
                required
                autoComplete='email'
              />
              {errors.email && <span className="field-error">{errors.email}</span>}

              <label htmlFor="password" style={{ marginTop: '16px' }}>Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              {errors.password && <span className="field-error">{errors.password}</span>}


              <label htmlFor="confirm_password" style={{ marginTop: '16px' }}>Confirm Password</label>
              <input
                id="confirm_password"
                type="password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                required
              />
              {errors.confirm_password && <span className="field-error">{errors.confirm_password}</span>}
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
                autoComplete='tel'
              />
              {errors.phone_number && <span className="field-error">{errors.phone_number}</span>}

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
              </select>
              {errors.user_type && <span className="field-error">{errors.user_type}</span>}

              {form.user_type && (
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
                    {form.user_type === 'visitor' && (
                      <>
                        <option value="visitor">Visitor</option>
                      </>
                    )}
                  </select>
                  {errors.permit_type && (
                    <span className="field-error">{errors.permit_type}</span>
                  )}
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
              />
              {errors.driver_license_number && (
                <span className="field-error">{errors.driver_license_number}</span>
              )}


              <label htmlFor="dl_state" style={{ marginTop: '16px' }}>Driver License State</label>
              <select
                id="dl_state"
                name="dl_state"
                value={form.dl_state}
                onChange={handleChange}
              >
                <option value="">Select State</option>
                {us_states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.dl_state && <span className="field-error">{errors.dl_state}</span>}

              <label htmlFor="address_line">Address</label>
              <input
                id="address_line"
                name="address_line"
                value={form.address_line}
                onChange={handleChange}
              />
              {errors.address_line && <span className="field-error">{errors.address_line}</span>}

              <div className="form-row" style={{ marginTop: '16px' }}>
                <div>
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                  />
                  {errors.city && <span className="field-error">{errors.city}</span>}
                </div>
                <div>
                  <label htmlFor="state_region">State/Region</label>
                  <input
                    id="state_region"
                    name="state_region"
                    value={form.state_region}
                    onChange={handleChange}
                  />
                  {errors.state_region && <span className="field-error">{errors.state_region}</span>}
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
                  />
                  {errors.postal_zip_code && <span className="field-error">{errors.postal_zip_code}</span>}
                </div>
                <div>
                  <label htmlFor="country">Country</label>
                  <input
                    id="country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    autoComplete='country'
                  />
                  {errors.postal_zip_code && <span className="field-error">{errors.postal_zip_code}</span>}
                </div>
              </div>
            </>
          )}

          <div className="auth-buttons">
            {step > 1 && <button type="button" className="auth-button secondary" onClick={back}>Back</button>}
            {step < 3 && <button type="button" className="auth-button" onClick={next}>Next</button>}
            {step === 3 && <button type="submit" className="auth-button" disabled={isRegistering}>Register</button>}
          </div>
        </form>

        {awaitingApproval && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Registration received!</h3>
              <p>
                Please wait while our admin reviews your account.
                You will also get an email confirmation shortly.
              </p>
              <p>You will be redirected after closing...</p>
              <button onClick={() => setAwaitingApproval(false)}>OK</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}