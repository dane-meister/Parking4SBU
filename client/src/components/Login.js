import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../stylesheets/Auth.css';

// LoginPage component handles user login functionality
export default function LoginPage() {
  const { login } = useAuth(); // Access the login function from the AuthContext
  const navigate = useNavigate(); // Hook to programmatically navigate between routes

  // State variables to manage form inputs and error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Function to handle form submission for login
  const handleLogin = async e => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const success = await login(email, password); // Attempt to log in with provided credentials
      if (success) {
        if (!success.isApproved) {
          setError("Your account is not approved yet."); // Set error message if account is not approved
          console.log("Your account is not approved yet.");
          return;
        } else {
          navigate('/home'); // Navigate to the home page on successful login
        }
      } else {
        setError("Invalid email or password."); // Set error message for invalid credentials
      }
    } catch (err) {
      setError("Invalid email or password."); // Handle unexpected errors
      console.error(err); // Log the error for debugging purposes
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        {/* Display error message if there is one */}
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor='email'>Email Address</label>
            {/* Input field for email */}
            <input
              id='email'
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)} // Update email state on input change
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor='password'>Password</label>
            {/* Input field for password */}
            <input
              id='password'
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)} // Update password state on input change
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

