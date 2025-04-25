import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../stylesheets/index.css';
import '../stylesheets/Admin.css';
import LotFormModal from '../components/LotFormModal';
import Popup from '../components/Popup';
const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000"; // Use environment variable for API URL

export default function Admin() {
  const [adminOption, setAdminOption] = useState('users');
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [lots, setLots] = useState([]);
  const [editingLot, setEditingLot] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  const [eventReservations, setEventReservations] = useState([]);
  const [toggleEventRefresh, setToggleEventRefresh] = useState(false);
  const [toggleFeedbackResponseRefresh, setToggleFeedbackResponseRefresh] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState(null);

  // Fetch users when 'Users' tab is selected
  useEffect(() => {
    if (adminOption === 'users') {
      axios.get(`${HOST}/api/admin/users`, {
        withCredentials: true
      })
        .then(res => setUsers(res.data))
        .catch(err => {
          console.error("Failed to fetch users", err);
          setUsers([]);
        });
    }
    if (adminOption === 'lots') {
      axios.get(`${HOST}/api/parking-lots`, {
        withCredentials: true
      })
        .then(res => setLots(res.data))
        .catch(err => {
          console.error("Failed to fetch lots", err);
          setLots([]);
        });
    }
    if (adminOption === 'events') {
      axios.get(`${HOST}/api/admin/event-reservations`, {
        withCredentials: true
      })
        .then(res => setEventReservations(res.data))
        .catch(err => {
          console.error("Failed to fetch event reservations", err);
          setEventReservations([]);
        });
    }
    if (adminOption === 'feedback') {
      axios.get(`${HOST}/api/admin/feedback`, { withCredentials: true })
        .then(res => setFeedbackList(res.data))
        .catch(err => {
          console.error("Failed to fetch feedback", err);
          setFeedbackList([]);
        });
    }
  }, [adminOption, toggleEventRefresh, toggleFeedbackResponseRefresh]);

  // Handle user approval or rejection
  const handleApproval = (userId, approve) => {
    if (approve) {
      axios.put(`${HOST}/api/admin/users/${userId}/approve`, {}, { withCredentials: true })
        .then(() => {
          // Refresh user list after approval
          setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, isApproved: true } : u));
        })
        .catch(err => console.error('Failed to approve user', err));
    } else {
      axios.delete(`${HOST}/api/admin/user/${userId}/remove`, { withCredentials: true })
        .then(() => {
          // Remove the user from the list
          setUsers(prev => prev.filter(u => u.user_id !== userId));
        })
        .catch(err => console.error('Failed to reject user', err));
    }
  };

  // Handle lot deletion
  const handleDeleteLot = (id) => {
    if (!window.confirm("Are you sure you want to delete this lot?")) return;

    axios.delete(`${HOST}/api/admin/parking-lots/${id}/remove`, { withCredentials: true })
      .then(() => {
        setLots(prev => prev.filter(lot => lot.id !== id));
      })
      .catch(err => console.error("Failed to delete lot", err));
  };

  const handleUpdateUser = (user) => {
    axios.put(`${HOST}/api/admin/users/${user.user_id}/edit`, user, {
      withCredentials: true
    })
      .then(() => {
        // Refresh user list
        setUsers(prev =>
          prev.map(u => (u.user_id === user.user_id ? { ...u, ...user } : u))
        );
        setEditingUser(null);
      })
      .catch(err => {
        console.error('Failed to update user', err);
        alert('Update failed');
      });
  };

  const handleFeedbackResponse = async (feedbackId, responseText) => {
    axios.put(`${HOST}/api/admin/feedback/${feedbackId}/respond`, {
      response_text: responseText
    }, { withCredentials: true })
      .then(() => {
        setToggleFeedbackResponseRefresh(prev => !prev);
      })
      .catch(err => {
        console.error('Failed to respond to feedback', err);
        alert('Failed to save response');
      });
  };

  // Handle event reservation approval
  const handleApproveEvent = (reservationId) => {
    axios.put(`${HOST}/api/admin/event-reservations/${reservationId}/approve`, {}, {
      withCredentials: true
    })
      .then(() => {
        setToggleEventRefresh(prev => !prev);
      })
      .catch(err => console.error('Failed to approve reservation', err));
  };

  // Handle event reservation rejection
  const handleRejectEvent = (reservationId) => {
    axios.put(`${HOST}/api/admin/event-reservations/${reservationId}/reject`, {}, {
      withCredentials: true
    })
      .then(() => {
        setEventReservations(prev =>
          prev.filter(r => r.id !== reservationId)
        );
      })
      .catch(err => console.error('Failed to reject reservation', err));
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
          <span>/</span>
          <span
            className={'type-hover ' + (adminOption === 'feedback' ? 'selected' : '')}
            onClick={() => setAdminOption('feedback')}
          >Feedback</span>
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
              name='user-search'
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="user-list">
              {users.length === 0 ? (
                <p>No users found.</p>
              ) : (
                users.map(user => (
                  <div className="user-card" key={user.user_id} onClick={() => setEditingUser(user)}>
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
            <button className="add-lot-button">Add a Lot</button>
            <h2>Manage Parking Lots</h2>
            <div className="user-list">
              {lots.length === 0 ? (
                <p>No parking lots found.</p>
              ) : (
                lots.map(lot => (
                  <div className="user-card" key={lot.id}>
                    <div className="user-info">
                      <strong>{lot.name}</strong><br />
                      ID: {lot.id}<br />
                      Location: {Array.isArray(lot.location?.coordinates)
                        ? `(${lot.location.coordinates[0][1]}, ${lot.location.coordinates[0][0]})`
                        : 'N/A'}<br />
                    </div>
                    <div className="user-actions">
                      <img
                        src="/images/edit-icon1.png"
                        alt="Edit Lot"
                        className="icon"
                        onClick={() => setEditingLot({ ...lot })}
                      />
                      <img
                        src="/images/x.png"
                        alt="Delete Lot"
                        className="icon"
                        onClick={() => handleDeleteLot(lot.id)}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
        {adminOption === 'events' && (
          <>
            <h2>Pending Event Parking Requests</h2>
            <div className="user-list">
              {eventReservations.filter(reservation => reservation.status === 'pending').length === 0 ? (
                <p>No pending event reservations found.</p>
              ) : (
                eventReservations.filter(reservation => reservation.status === 'pending')
                  .map(reservation => (
                    <div key={reservation.id} className="user-card">
                      <div className="user-info">
                        <strong>Reservation #{reservation.id}</strong><br />
                        User ID: {reservation.user_id}<br />
                        Lot ID: {reservation.parking_lot_id}<br />
                        Spots: {reservation.spot_count}<br />
                        Time: {new Date(reservation.start_time).toLocaleString()} - {new Date(reservation.end_time).toLocaleString()}<br />
                        Description: {reservation.event_description || "N/A"}
                      </div>
                      <div className="user-actions">
                        <img
                          src="/images/check.png"
                          alt="Approve"
                          className="icon"
                          onClick={() => handleApproveEvent(reservation.id)}
                        />
                        <img
                          src="/images/x.png"
                          alt="Reject"
                          className="icon"
                          onClick={() => handleRejectEvent(reservation.id)}
                        />

                      </div>
                    </div>
                  ))
              )}
            </div>
            <h2>All Event Parking</h2>
            <div className="user-list">
              {eventReservations.length === 0 ? (
                <p>No event reservations found.</p>
              ) : (
                eventReservations.map(reservation => (
                  <div key={reservation.id} className="user-card">
                    <div className="user-info">
                      <strong>Reservation #{reservation.id}</strong><br />
                      User ID: {reservation.user_id}<br />
                      Lot ID: {reservation.parking_lot_id}<br />
                      Spots: {reservation.spot_count}<br />
                      Time: {new Date(reservation.start_time).toLocaleString()} - {new Date(reservation.end_time).toLocaleString()}<br />
                      Description: {reservation.event_description || "N/A"}<br />
                      Status: {reservation.status}<br />
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
        {adminOption === 'analysis' && (
          <div>
            <h2>Analysis</h2>
            <p>Data analysis tools will be available here.</p>
          </div>
        )}
        {adminOption === 'feedback' && (
          <>
            <h2>User Feedback</h2>
            <div className="user-list">
              {feedbackList.length === 0 ? (
                <p>No feedback found.</p>
              ) : (
                feedbackList.map(feedback => (
                  <div className="user-card" key={feedback.feedback_id}>
                    <div className="user-info">
                      User ID: {feedback.user_id}<br />
                      Lot ID: {feedback.parking_lot_id}<br />
                      Feedback: {feedback.feedback_text}<br />
                      Rating: {feedback.rating}<br />
                      Response: {feedback.admin_response || "No response yet"}<br />
                      <button className="respond-button" onClick={() => setActiveFeedback(feedback)}>
                        Respond
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
      {editingUser && (
        <div className="edit-modal" onClick={() => setEditingUser(null)}>
          <div className="edit-form" onClick={(e) => e.stopPropagation()}>
            <h2>Edit User</h2>

            <label htmlFor="edit-email">Email:</label>
            <input
              id="edit-email"
              type="text"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            />

            <label htmlFor="edit-user-type">User Type:</label>
            <select
              id="edit-user-type"
              value={editingUser.user_type}
              onChange={(e) => setEditingUser({ ...editingUser, user_type: e.target.value, permit_type: '' })}
            >
              <option value="">Select Type</option>
              <option value="faculty">Faculty</option>
              <option value="resident">Resident</option>
              <option value="commuter">Commuter</option>
              <option value="visitor">Visitor</option>
            </select>

            <label htmlFor="edit-permit-type">Permit Type:</label>
            <select
              id="edit-permit-type"
              value={editingUser.permit_type}
              onChange={(e) => setEditingUser({ ...editingUser, permit_type: e.target.value })}
            >
              <option value="">Select Permit</option>

              {editingUser.user_type === 'faculty' && (
                <>
                  <option value="faculty">Faculty</option>
                  <option value="faculty-life-sciences-1">Faculty Life Sciences 1</option>
                  <option value="faculty-life-sciences-2">Faculty Life Sciences 2</option>
                  <option value="faculty-garage-gated-1">Faculty Garage/Gated: CSEA/UUP/PEF/PBA/NUSCOPBA</option>
                  <option value="faculty-garage-gated-2">Faculty Garage/Gated: GSEU/MC/Research</option>
                  <option value="premium">Premium</option>
                </>
              )}

              {editingUser.user_type === 'resident' && (
                <>
                  <option value="resident-zone1">Resident Zone 1</option>
                  <option value="resident-zone2">Resident Zone 2</option>
                  <option value="resident-zone3">Resident Zone 3</option>
                  <option value="resident-zone4">Resident Zone 4</option>
                  <option value="resident-zone5">Resident Zone 5</option>
                  <option value="resident-zone6">Resident Zone 6</option>
                </>
              )}

              {editingUser.user_type === 'commuter' && (
                <>
                  <option value="core">Core</option>
                  <option value="perimeter">Perimeter</option>
                  <option value="satellite">Satellite</option>
                </>
              )}

              {editingUser.user_type === 'visitor' && (
                <>
                  <option value="visitor">Visitor</option>
                </>
              )}
            </select>

            <div className="form-buttons">
              <button onClick={() => setEditingUser(null)}>Cancel</button>
              <button className="save-button" onClick={() => handleUpdateUser(editingUser)}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {activeFeedback && (
        <Popup
          name="feedback-response"
          popupHeading={`Respond to Feedback #${activeFeedback.feedback_id}`}
          closeFunction={() => setActiveFeedback(null)}
        >
          <textarea
            value={activeFeedback.admin_response || ""}
            onChange={(e) =>
              setActiveFeedback(prev => ({ ...prev, admin_response: e.target.value }))
            }
            rows={5}
            style={{ width: "100%", marginTop: "1rem" }}
          />
          <div className="form-buttons" style={{ marginTop: "1rem" }}>
            <button onClick={() => setActiveFeedback(null)}>Cancel</button>
            <button
              className="save-button"
              onClick={() => handleFeedbackResponse(activeFeedback.feedback_id, activeFeedback.admin_response)}
            >
              Save Response
            </button>
          </div>
        </Popup>
      )}

      <LotFormModal
        isOpen={!!editingLot}
        lot={editingLot}
        onRequestClose={() => setEditingLot(false)}
      ></LotFormModal>

    </main>
  );
}