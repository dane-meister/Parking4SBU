import React from "react";
import "../stylesheets/Footer.css"; // Import CSS for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-info">
        <p>&copy; {new Date().getFullYear()} P4SBU. All rights reserved.</p>
      </div>
      <button className="feedback-btn">Leave Feedback</button>
    </footer>
  );
};

export default Footer;
