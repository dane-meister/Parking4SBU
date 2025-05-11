import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../stylesheets/AuthForms.css';


export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState('');
  const [status, setStatus]     = useState('');
  const navigate                = useNavigate();
  const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';


  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('Sending reset link…');
    try {
      await axios.post(`${API}/api/auth/forgot-password`, { email });
      setStatus('If that email exists, you’ll receive a reset link shortly.');
    } catch {
      setStatus('Error sending reset link. Please try again.');
    } finally {
      // redirect back to login after 5s
      setTimeout(() => navigate('/auth/login'), 5000);
    }
};

return (
    <div className="auth-container">
        <div className="auth-card">
      <h2 className="auth-title">Forgot Password</h2>
      <p className="auth-subtitle">Forgot your password? Too bad so sad. Enter your email and we might send you a reset link.</p>
      <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label htmlFor='email'>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        </div>
        <div className="auth-buttons">
        <button type="submit" className="auth-button">Send Reset Link</button>
        </div>
      </form>
      {status && <p className="auth-info">{status}</p>}
    </div>
    </div>
  );
}