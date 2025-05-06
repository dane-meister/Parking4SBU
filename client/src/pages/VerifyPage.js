import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api'; 

export default function VerifyPage() {
  const [status, setStatus] = useState('Verifying your account…');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  

  useEffect(() => {
    if (!token) {
      setStatus('No token provided.');
      // after a moment, send them back to login
      setTimeout(() => navigate('/auth/login'), 3000);
      return;
    }

    axios
      .get(`${API_BASE}/auth/verify?token=${token}`)
      .then(res => {
        setStatus(res.data.message);
      })
      .catch(err => {
        setStatus(err.response?.data?.message || 'Verification failed.');
      })
      .finally(() => {
        // Redirect to login after showing the result for 3s
        setTimeout(() => navigate('/auth/login'), 3000);
      });
  }, [token, navigate]);

  return (
    <div className="auth-container">
      <h2>Email Verification</h2>
      <p>{status}</p>
      <p>(You’ll be redirected to login shortly.)</p>
    </div>
  );
}
