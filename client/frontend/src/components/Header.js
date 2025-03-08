import React from "react";
import { Link } from 'react-router'
import '../stylesheets/Header.css';


const Header = () => {
  return (
    <>
    <header className="header">
        <div className="header-left">
          <img className="logo" src="/images/sbu-logo.png" alt="Stony Brook Logo" />
          <div className="header-title">P4SBU</div>
        </div>
        <div className="header-right">
          <Link to="/profile">
            <img className="profile-icon" src="/images/profile.png" alt="Profile Icon" />
          </Link>
        </div>
      </header>
      <nav className="nav-banner">
        <Link to="/">Home</Link>
        <Link to="/tickets">Tickets</Link>
        <Link to="/reservations">Reservations</Link>
      </nav>
    
    </>

  );
};

export default Header;
