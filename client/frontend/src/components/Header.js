import React from "react";
import { Link } from 'react-router'
import '../stylesheets/Header.css';


const Header = () => {
  return (
    <header className="header">
      <Link to='/' style={{textDecoration: 'none', color: 'white'}}>
        <div className="header-title">P4SBU</div>
      </Link>
      <div className="header-right">
        <button className="tickets-btn">Tickets</button>
        <Link to='/profile'>
          <div className="profile-icon">👤</div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
