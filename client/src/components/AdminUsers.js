import React from 'react';

export default function AdminUsers({
  users,
  searchTerm,
  setSearchTerm,
  handleApproval,
  setEditingUser,
  handleDeleteUser,
  setActiveTicketUser
}) {
  return (
    <>
      <h2>Unapproved Users</h2>
      <div className="user-list">
        {users.filter(user => !user.isApproved).length === 0 ? (
          <p>No unapproved users found.</p>
        ) : (
          users
            .filter(user => !user.isApproved)
            .map(user => (
              <div className="user-card" key={user.user_id}>
                <div className="user-info">
                  <strong style={{ fontFamily: 'Barlow Bold, sans-serif' }}>{user.first_name} {user.last_name}</strong><br />
                  ID: {user.user_id}<br />
                  Email: {user.email}<br />
                  Type: {user.user_type}<br />
                  Permit: {user.permit_type}<br />
                  Joined: {new Date(user.createdAt).toLocaleDateString()}<br />
                </div>
                <div className="user-actions">
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => handleApproval(user.user_id, true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleApproval(user.user_id, true);
                      }
                    }}
                  >
                    <img
                      src="/images/check.png"
                      alt="Approve"
                      className="icon"
                      style={{ pointerEvents: 'none' }} // So the span handles the click, not the image
                    />
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => handleApproval(user.user_id, false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleApproval(user.user_id, false);
                      }
                    }}
                  >
                    <img
                      src="/images/x.png"
                      alt="Reject"
                      className="icon"
                      style={{ pointerEvents: 'none' }}
                    />
                  </span>
                </div>
              </div>
            ))
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
          users
            .filter(user =>
              `${user.first_name} ${user.last_name} ${user.email}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map(user => (
              <div
                className="user-card"
                key={user.user_id}
                style={{ position: 'relative', paddingBottom: '20px' }}
              >
                <div className="user-info">
                  <strong style={{ fontSize: '1.1rem', fontFamily: 'Barlow Bold, sans-serif' }}>{user.first_name} {user.last_name}</strong><br />
                  <span>ID: {user.user_id}</span><br />
                  <span><b>Email:</b> {user.email}</span><br />
                  <span><b>Type:</b> {user.user_type}</span><br />
                  <span><b>Permit:</b> {user.permit_type || 'N/A'}</span><br />
                  <span><b>Joined:</b> {new Date(user.createdAt).toLocaleDateString()}</span><br />
                  <span><b>Approved:</b> {user.isApproved ? 'Yes' : 'No'}</span><br />
                  <span><b>Verified:</b> {user.isVerified ? 'Yes' : 'No'}</span><br />
                </div>
                <div className="user-actions">
                  <img
                    src="/images/ticket.png"
                    alt="Give Ticket"
                    className="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTicketUser(user);
                    }}
                  />
                  <img
                    src="/images/edit-icon1.png"
                    alt="Edit User"
                    className="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingUser(user);
                    }}
                  />
                  <img
                    src="/images/x.png"
                    alt="Delete User"
                    className="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUser(user.user_id);
                    }}
                  />
                </div>
              </div>
            ))
        )}
      </div>
    </>
  );
}
