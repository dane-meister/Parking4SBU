import React from "react";
import '../stylesheets/Header.css';


const Header = () => {
  return (
    <header className="header">
      <div className="header-title">P4SBU</div>
      <div className="header-right">
        <button className="tickets-btn">Tickets</button>
        <div className="profile-icon">👤</div>
      </div>
    </header>
  );
};

export default Header;
