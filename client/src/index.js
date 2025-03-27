import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./stylesheets/index.css"; // Global styles


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

// Create a root for React rendering
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the main App component inside React.StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);