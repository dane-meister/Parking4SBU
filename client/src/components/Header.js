import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import '../stylesheets/Header.css';


const Header = ({selectedLot, setSelectedLot}) => {
  
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.header');
      const navBanner = document.querySelector('.nav-banner');
  
      if (header && navBanner) {
        if (window.scrollY > 100) {
          header.classList.add('collapsed');
          navBanner.classList.add('fixed');
        } else {
          header.classList.remove('collapsed');
          navBanner.classList.remove('fixed');
        }
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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
        <Link to="/home" onClick={() => setSelectedLot(null)}>Home</Link>
        <Link to="/tickets">Tickets</Link>
        <Link to="/reservations">Reservations</Link>
      </nav>
    
    </>

  );
};

export default Header;
