import React from "react";
import { Link } from 'react-router'
import '../stylesheets/Header.css';


// Header component that displays the top navigation bar and logo
const Header = ({selectedLot, setSelectedLot}) => {
  return (
    <>
      {/* Main header section */}
      <header className="header">
        <div className="header-left">
          {/* Stony Brook University logo */}
          <img className="logo" src="/images/sbu-logo.png" alt="Stony Brook Logo" />
          <div className="header-title">P4SBU</div>
        </div>
        <div className="header-right">
          {/* Link to the profile page */}
          <Link to="/profile">
            <img className="profile-icon" src="/images/profile.png" alt="Profile Icon" />
          </Link>
        </div>
      </header>

      {/* Navigation banner with links */}
      <nav className="nav-banner">
        {/* Link to the home page, resets selectedLot to null */}
        <Link to="/" onClick={() => setSelectedLot(null)}>Home</Link>
        {/* Link to the tickets page */}
        <Link to="/tickets">Tickets</Link>
        {/* Link to the reservations page */}
        <Link to="/reservations">Reservations</Link>
      </nav>
    </>
  );
};

export default Header;
