import React from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ProfileSidebar component displays a sidebar for account management
// Props:
// - username: the name of the user
// - activeTab: the currently active tab in the sidebar
// - setActiveTab: function to update the active tab
export default function ProfileSidebar({ username, activeTab, setActiveTab, setCurrVehiclePage }) {
  const { logout } = useAuth(); // Access the logout function from AuthContext
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleSignOut = async () => {
    try {
      // Optional: notify backend to clear secure cookie
      await fetch("http://localhost:8000/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });

      logout(); // Clear frontend state
      navigate("/auth/login");
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  const handleVehicleBtn = () => {
    setActiveTab('vehicles');
    setCurrVehiclePage('my_vehicles');
  };

  return (
    <section className="account-sidebar">
      {/* Sidebar header */}
      <h2>My Account</h2>
      <p>{username}</p>

      <div className="account-section">
        <p>ACCOUNT SETTINGS</p>

        {/* Profile tab button */}
        <button
          className={`sidebar-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>

        {/* Vehicles tab button */}
        <button
          className={`sidebar-btn ${activeTab === 'vehicles' ? 'active' : ''}`}
          onClick={handleVehicleBtn}
        >
          Vehicles
        </button>

        {/* Sign Out button */}
        <button
          className="sidebar-btn"
          id='sign-out'
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    </section>
  );
}