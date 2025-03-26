import React from "react";

export default function AccountSidebar({ username, activeTab, setActiveTab }) {
    return (
      <section className="account-sidebar">
        <h2>My Account</h2>
        <p>{username}</p>
  
        <div className="account-section">
          <p>ACCOUNT SETTINGS</p>
          <div
            className={`sidebar-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </div>
  
          <div
            className={`sidebar-btn ${activeTab === 'vehicles' ? 'active' : ''}`}
            onClick={() => setActiveTab('vehicles')}
          >
            Vehicles
          </div>

        <div
            className="sidebar-btn"
            id='sign-out'
        >
            Sign Out
        </div>
        </div>
      </section>
    );
  }