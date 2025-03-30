import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../stylesheets/Auth.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async e => {
    e.preventDefault();
    try{
      const success = await login(email, password);
      if (success){
        navigate('/home');
      }
      else {
        setError("Invalid email or password.");
      }
      
    } catch (err) {
      setError("Invalid email or password.");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor='email'>Email Address</label>
            <input
              id='email'
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          </div>

          <button type="submit" className="auth-button">Login</button>
        </form>

        <div className="auth-footer">
          <span>Don’t have an account?</span>
          <Link to="/auth/register" className="auth-link">Register</Link>
        </div>
      </div>
    </div>
  );
}

