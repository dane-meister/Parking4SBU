import React from "react";
import { Link } from 'react-router-dom'
import '../stylesheets/Header.css';


// Header component that displays the top navigation bar and logo
const Header = ({selectedLot, setSelectedLot}) => {
  // Add an event listener to handle scroll events
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header'); // Select the header element
  const navBanner = document.querySelector('.nav-banner'); // Select the navigation banner element
  
  // Set threshold – e.g., once scrolling past 100px, collapse header
  if (window.scrollY > 100) {
    header.classList.add('collapsed'); // Add 'collapsed' and 'fixed' class to header when scrolled past 100px
    navBanner.classList.add('fixed'); 
  } else {
    header.classList.remove('collapsed'); // Remove 'collapsed' and 'fixed' class when scrolled back above 100px
    navBanner.classList.remove('fixed');
  }
});
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
