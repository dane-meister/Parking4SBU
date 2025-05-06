import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../stylesheets/Auth.css';
const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000";

// LoginPage component handles user login functionality
export default function LoginPage() {
  const { login } = useAuth(); // Access the login function from the AuthContext
  const navigate = useNavigate(); // Hook to programmatically navigate between routes

  // State variables to manage form inputs and error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(true);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(''); // Clear error on email change
  };
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  
  const handleResendEmail = async () => {
    if (!canResend) return;
  
    setCanResend(false); // block sending again
    try {
      const res = await axios.post(`${HOST}/api/admin/resend-verification`, { email });
      alert(res.data.message || "Verification email sent");
  
      // Optional: show a toast or timer
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to resend email");
    } finally {
      // Re-enable after 30 seconds
      setTimeout(() => setCanResend(true), 30 * 1000);
    }
  };

  // Function to handle form submission for login
  const handleLogin = async e => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const { success, user, message } = await login(email, password); // Attempt to log in with provided credentials
      
      if (!success) {
        setError(message); // Set error message if login fails
        console.log(message); // Log the error message for debugging
        return;
      }

      if (!user.isApproved) {
        setError("Your account is not approved yet.");
        console.log("Your account is not approved yet.");
        return;
      }

      if (!user.isVerified) {
        setError("Please verify your email via the link we sent.");
        console.log("Please verify your email via the link we sent.");
        return;
     }

    // All checks passed
    navigate('/');
    } catch (err) {
      setError("Something went wrong. Please try again."); // Set a generic error message if an exception occurs
      console.error(err); // Log the error for debugging
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        {/* Display error message if there is one */}
        {error && <p className="auth-error">{error}
        {error === "Please verify your email via the link we sent" && (
          <div>
          <p>Didn’t get it?
          <span
            onClick={handleResendEmail}
            disabled={!canResend}
            className="auth-link"
            style={{ cursor: 'pointer' }}
          >
            {canResend ? "Resend Email" : "Please wait before tying again..."}
          </span></p>
          </div>
        )}</p>}
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor='email'>Email Address</label>
            {/* Input field for email */}
            <input
              id='email'
              type="email"
              value={email}
              onChange={handleEmailChange} // Update email state on input change
              required
              autoComplete='email'
            />
          </div>

          <div className="form-group">
            <label htmlFor='password'>Password</label>
            {/* Input field for password */}
            <input
              id='password'
              type="password"
              value={password}
              onChange={handlePasswordChange} // Update password state on input change
              required
            />
          </div>

          {/* Submit button for the login form */}
          <button type="submit" className="auth-button">Login</button>
        </form>
        <div className="auth-footer">
          <span>Don’t have an account?</span>
          {/* Link to the registration page */}
          <Link to="/auth/register" className="auth-link">Register</Link>
        </div>
      </div>
    </div>
  );
}

