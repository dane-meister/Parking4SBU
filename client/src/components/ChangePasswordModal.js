import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function ChangePasswordModal({ onClose }) {
    const [current, setCurrent] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [status, setStatus] = useState("");
    const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000";

    const currentRef = useRef(null);

    //focus on the current password field when the modal opens
    useEffect(() => {
        currentRef.current?.focus();
    }, []);

    const pwdMatchMsg =
        !confirm
            ? ""
            : newPass === confirm
                ? "Passwords match"
                : "Passwords do not match";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!current || !newPass || !confirm) {
            setError("All fields are required.");
            return;
        }
        if (newPass !== confirm) {
            setError("New passwords do not match.");
            return;
        }


        try {
            const res = await axios.put(
                `${HOST}/api/auth/change-password`,
                { currentPassword: current, newPassword: newPass },
                { withCredentials: true }
            );
            setStatus(res.data.message);
            setTimeout(onClose, 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to change password.");
        }
    };

    return (
        <div className="change-pwd-modal modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Change Password</h3>
                </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="current-password">Current Password</label>
                            <input
                                id="current-password"
                                type="password"
                                value={current}
                                onChange={(e) => setCurrent(e.target.value)}
                                ref={currentRef}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="new-password">New Password</label>
                            <input
                                id="new-password"
                                type="password"
                                value={newPass}
                                onChange={(e) => setNewPass(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirm New Password</label>
                            <input
                                id="confirm-password"
                                type="password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                            />
                            {pwdMatchMsg && (
                                <span
                                    className={`password-match ${pwdMatchMsg === "Passwords match" ? "valid" : "invalid"
                                        }`}
                                >
                                    {pwdMatchMsg}
                                </span>
                            )}
                        </div>

                        {error && <p className="field-error">{error}</p>}
                        {status && <p className="auth-info">{status}</p>}

                        <div className="auth-buttons">
                            <button
                                type="button"
                                className="auth-button cancel"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button onClick={handleSubmit} className="auth-button">
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            );
}
