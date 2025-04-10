import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../stylesheets/index.css';
import '../stylesheets/Admin.css';

export default function Admin() {
    const [adminOption, setAdminOption] = useState('users');
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch users when 'Users' tab is selected
    useEffect(() => {
        if (adminOption === 'users') {
            axios.get('http://localhost:8000/api/auth/users', {
                withCredentials: true
            })
                .then(res => setUsers(res.data))
                .catch(err => {
                    console.error("Failed to fetch users", err);
                    setUsers([]);
                });
        }
    }, [adminOption]);

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
                                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
                {adminOption === 'lots' && <div>Lots Management</div>}
                {adminOption === 'events' && <div>Events Management</div>}
                {adminOption === 'analysis' && <div>Analysis Management</div>}
            </div>
        </main>
    );
}