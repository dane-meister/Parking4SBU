import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../stylesheets/index.css';
import '../stylesheets/Admin.css';
const HOST = "http://localhost:8000"

export default function Admin() {
    const [adminOption, setAdminOption] = useState('users');
    const [users, setUsers] = useState([]);
    const [lots, setLots] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch users when 'Users' tab is selected
    useEffect(() => {
        if (adminOption === 'users') {
            axios.get(`${HOST}/api/auth/users`, {
                withCredentials: true
            })
                .then(res => setUsers(res.data))
                .catch(err => {
                    console.error("Failed to fetch users", err);
                    setUsers([]);
                });
        }
        if (adminOption === 'lots') {
            axios.get('http://localhost:8000/api/parking-lots', {
                withCredentials: true
            })
                .then(res => setLots(res.data))
                .catch(err => {
                    console.error("Failed to fetch lots", err);
                    setLots([]);
                });
        }
    }, [adminOption]);

    // Handle user approval or rejection
    const handleApproval = (userId, approve) => {
        if (approve) {
            axios.put(`http://localhost:8000/api/auth/users/${userId}/approve`, {}, { withCredentials: true })
                .then(() => {
                    // Refresh user list after approval
                    setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, isApproved: true } : u));
                })
                .catch(err => console.error('Failed to approve user', err));
        } else {
            axios.delete(`http://localhost:8000/api/auth/user/${userId}/remove`, { withCredentials: true })
                .then(() => {
                    // Remove the user from the list
                    setUsers(prev => prev.filter(u => u.user_id !== userId));
                })
                .catch(err => console.error('Failed to reject user', err));
        }
    };

    // Handle lot deletion
    const handleDeleteLot = (lotId) => {
        if (!window.confirm("Are you sure you want to delete this lot?")) return;

        axios.delete(`http://localhost:8000/api/admin/lots/${lotId}/remove`, { withCredentials: true })
            .then(() => {
                setLots(prev => prev.filter(lot => lot.lot_id !== lotId));
            })
            .catch(err => console.error("Failed to delete lot", err));
    };

    return (
        <main className="admin">
            <h1>Admin</h1>
            <div className='hbox'>
                <div
                    className="hbox selection"
                    id="admin-selection"
                    style={{ marginRight: '35px' }}
                >
                    <span
                        className={'type-hover ' + (adminOption === 'users' ? 'selected' : '')}
                        onClick={() => setAdminOption('users')}
                    >Users</span>
                    <span>/</span>
                    <span
                        className={'type-hover ' + (adminOption === 'lots' ? 'selected' : '')}
                        onClick={() => setAdminOption('lots')}
                    >Lots</span>
                    <span>/</span>
                    <span
                        className={'type-hover ' + (adminOption === 'events' ? 'selected' : '')}
                        onClick={() => setAdminOption('events')}
                    >Events</span>
                    <span>/</span>
                    <span
                        className={'type-hover ' + (adminOption === 'analysis' ? 'selected' : '')}
                        onClick={() => setAdminOption('analysis')}
                    >Analysis</span>
                </div>
            </div>
            <div className='admin-content'>
                {adminOption === 'users' && (
                    <>
                        <h2>Unapproved Users</h2>
                        <div className="user-list">
                            {users.filter(user => !user.isApproved).length === 0 ? (
                                <p>No unapproved users found.</p>
                            ) : (
                                users
                                    .filter(user => !user.isApproved)
                                    .filter(user =>
                                        `${user.first_name} ${user.last_name} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map(user => (
                                        <div className="user-card" key={user.user_id}>
                                            <div className="user-info">
                                                <strong>{user.first_name} {user.last_name}</strong><br />
                                                ID: {user.user_id}<br />
                                                Email: {user.email}<br />
                                                Type: {user.user_type}<br />
                                                Permit: {user.permit_type}<br />
                                                Joined: {new Date(user.createdAt).toLocaleDateString()}<br />
                                            </div>
                                            <div className="user-actions">
                                                <img
                                                    src="/images/check.png"
                                                    alt="Approve"
                                                    className="icon"
                                                    onClick={() => handleApproval(user.user_id, true)}
                                                />
                                                <img
                                                    src="/images/x.png"
                                                    alt="Reject"
                                                    className="icon"
                                                    onClick={() => handleApproval(user.user_id, false)}
                                                />
                                            </div>
                                        </div>))
                            )}
                        </div>
                        <h2>All Users</h2>
                        <input
                            type="text"
                            className="user-search"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <div className="user-list">
                            {users.length === 0 ? (
                                <p>No users found.</p>
                            ) : (
                                users.map(user => (
                                    <div className="user-card" key={user.user_id}>
                                        <strong>{user.first_name} {user.last_name}</strong><br />
                                        ID: {user.user_id}<br />
                                        Email: {user.email}<br />
                                        Type: {user.user_type}<br />
                                        Permit: {user.permit_type}<br />
                                        Joined: {new Date(user.createdAt).toLocaleDateString()}<br />
                                        Approved: {user.isApproved ? 'Yes' : 'No'}<br />
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
                {adminOption === 'lots' && (
                    <>
                        <h2>Manage Parking Lots</h2>
                        <div className="user-list">
                            {lots.length === 0 ? (
                                <p>No parking lots found.</p>
                            ) : (
                                lots.map(lot => (
                                    <div className="user-card" key={lot.lot_id}>
                                        <div className="user-info">
                                            <strong>{lot.name}</strong><br />
                                            ID: {lot.id}<br />
                                            Location: {Array.isArray(lot.location?.coordinates)
                                                ? `(${lot.location.coordinates[0][1]}, ${lot.location.coordinates[0][0]})`
                                                : 'N/A'}<br />
                                        </div>
                                        <div className="user-actions">
                                            <img
                                                src="/images/x.png"
                                                alt="Delete Lot"
                                                className="icon"
                                                onClick={() => handleDeleteLot(lot.lot_id)}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}                {adminOption === 'events' && <div>Events Management</div>}
                {adminOption === 'analysis' && <div>Analysis Management</div>}
            </div>
        </main>
    );
}