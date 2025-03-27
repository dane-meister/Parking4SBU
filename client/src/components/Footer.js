import React from "react";
import "../stylesheets/Footer.css"; 

// Footer component to display footer information and a feedback button
const Footer = () => {
  return (
    <footer className="footer">
      {/* Footer information section */}
      <div className="footer-info">
        {/* Display current year dynamically */}
        <p>&copy; {new Date().getFullYear()} P4SBU. All rights reserved.</p>
      </div>
      {/* Feedback button */}
      <button className="feedback-btn">Leave Feedback</button>
    </footer>
  );
};

export default Footer; // Export Footer component for use in other parts of the application
