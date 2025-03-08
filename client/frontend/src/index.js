import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./stylesheets/index.css"; // Global styles



window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  const navBanner = document.querySelector('.nav-banner');
  
  // Set threshold – e.g., once scrolling past 100px, collapse header
  if (window.scrollY > 100) {
    header.classList.add('collapsed');
    navBanner.classList.add('fixed');
  } else {
    header.classList.remove('collapsed');
    navBanner.classList.remove('fixed');
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);