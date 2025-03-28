import React from "react";

// AccountSidebar component displays a sidebar for account management
// Props:
// - username: the name of the user
// - activeTab: the currently active tab in the sidebar
// - setActiveTab: function to update the active tab
export default function AccountSidebar({ username, activeTab, setActiveTab }) {
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
            onClick={() => setActiveTab('vehicles')}
          >
            Vehicles
          </button>

          {/* Sign Out button */}
          <button
            className="sidebar-btn"
            id='sign-out'
          >
            Sign Out
          </button>
        </div>
      </section>
    );
}