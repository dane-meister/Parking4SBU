import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../stylesheets/index.css';
import '../stylesheets/Admin.css';
import AdminTabSelector from '../components/AdminTabSelector';
import AdminUsers from '../components/AdminUsers';
import AdminLots from '../components/AdminLots';
import AdminEvents from '../components/AdminEvents';
import AdminFeedback from '../components/AdminFeedback';
import AdminAnalysis from '../components/AdminAnalysis';
import LotFormModal from '../components/LotFormModal';
import Popup from '../components/Popup';
import TicketForm from '../components/TicketForm';
import FeedbackFormModal from '../components/FeedbackFormModal';
const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000"; // Use environment variable for API URL

export default function Admin() {
  const [adminOption, setAdminOption] = useState('users');
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [lots, setLots] = useState([]);
  const [editingLot, setEditingLot] = useState(null);
  const [addingLot, setAddingLot] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  const [eventReservations, setEventReservations] = useState([]);
  const [toggleEventRefresh, setToggleEventRefresh] = useState(false);
  const [toggleFeedbackResponseRefresh, setToggleFeedbackResponseRefresh] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState(null);
  const [activeTicketUser, setActiveTicketUser] = useState(null);
  const [newTicket, setNewTicket] = useState({
    plate: '',
    permit: '',
    location: '',
    space: '',
    violation: '',
    comments: '',
    fine: '',
    officer_id: ''
  });
  const [addLotForm, setAddLotForm] = useState(false);

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
      <AdminTabSelector
        adminOption={adminOption}
        setAdminOption={setAdminOption}
      />
      <div className='admin-content'>
        {adminOption === 'users' && (
          <AdminUsers
            users={users}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleApproval={handleApproval}
            setEditingUser={setEditingUser}
            setActiveTicketUser={setActiveTicketUser}
          />
        )}
        {adminOption === 'lots' && (
          <AdminLots
            lots={lots}
            setEditingLot={setEditingLot}
            handleDeleteLot={handleDeleteLot}
            setAddLotForm={setAddLotForm}
          />
        )}
        {adminOption === 'events' && (
          <AdminEvents
            eventReservations={eventReservations}
            handleApproveEvent={handleApproveEvent}
            handleRejectEvent={handleRejectEvent}
          />
        )}
        {adminOption === 'analysis' && <AdminAnalysis />}
        {adminOption === 'feedback' && (
          <AdminFeedback
            feedbackList={feedbackList}
            setActiveFeedback={setActiveFeedback}
          />
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

      <LotFormModal
        isOpen={!!editingLot || addLotForm}
        lot={editingLot}
        onRequestClose={() => {
          setEditingLot(null);
          setAddLotForm(false);
        }}
        formType={addLotForm ? 'add' : 'edit'}
      />

      <FeedbackFormModal
        isOpen={activeFeedback !== null}
        onRequestClose={() => setActiveFeedback(null)}
        feedback={activeFeedback}
        refreshFeedbackList={() => setToggleFeedbackResponseRefresh(prev => !prev)}
      />

      {activeTicketUser && (
        <div className="ticket-popup-overlay" onClick={() => setActiveTicketUser(null)}>
          <div className="ticket-popup-form" onClick={(e) => e.stopPropagation()}>
            <TicketForm
              user={activeTicketUser}
              onSuccess={() => setActiveTicketUser(null)}
              onCancel={() => setActiveTicketUser(null)}
            />
          </div>
        </div>
      )}

    </main>
  );
}
