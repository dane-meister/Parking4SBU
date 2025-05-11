import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../stylesheets/AuthForms.css';


export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [status, setStatus] = useState('');
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    const handleSubmit = async e => {
        e.preventDefault();
        setSubmitted(true);

        const eobj = {};
        if (!newPass) {
            eobj.newPass = 'New password is required';
        }
        if (!confirmPass) {
            eobj.confirmPass = 'Please confirm your password';
        } else if (newPass !== confirmPass) {
            eobj.confirmPass = 'Passwords do not match';
        }
        setErrors(eobj);
        if (Object.keys(eobj).length) return;

        setStatus('Resetting password…');
        try {
            await axios.post(`${API}/api/auth/reset-password`, { token, newPassword: newPass });
            setStatus('Password reset! Redirecting to login…');
            setTimeout(() => navigate('/auth/login'), 3000);
        } catch {
            setStatus('Invalid or expired link.');
            setTimeout(() => navigate('/auth/forgot-password'), 3000);
        }
    };

    const [pwdMsg, setPwdMsg] = useState('');
    useEffect(() => {
        if (!confirmPass) {
            setPwdMsg('');
        } else if (newPass === confirmPass) {
            setPwdMsg('Passwords match');
        } else {
            setPwdMsg('Passwords do not match');
        }
    }, [newPass, confirmPass]);



    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Reset Password</h2>
                <p className="auth-subtitle">Time for a new password because obviously the last one was too memorable. Enter something you can actually remember.</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="password">Enter New Password</label>
                        <input
                            type="password"
                            value={newPass}
                            onChange={e => setNewPass(e.target.value)}
                            required
                        />
                        {submitted && errors.newPass && <span className="field-error">{errors.newPass}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm_password">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPass}
                            onChange={e => setConfirmPass(e.target.value)}
                            required
                        />
                        {pwdMsg && (
                            <span className={`password-match ${pwdMsg === 'Passwords match' ? 'valid' : 'invalid'}`}>
                                {pwdMsg}
                            </span>
                        )}
                        {submitted && errors.confirmPass && <span className="field-error">{errors.confirmPass}</span>}
                    </div>

                    <div className="auth-buttons">
                        <button
                            type="button"
                            className="auth-button secondary"
                            onClick={() => navigate('/auth/login')}
                        >Cancel
                        </button>
                        <button type="submit" className="auth-button">Reset Password</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
