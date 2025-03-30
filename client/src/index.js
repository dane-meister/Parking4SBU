import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./stylesheets/index.css"; // Global styles

// Create a root for React rendering
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the main App component inside React.StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);