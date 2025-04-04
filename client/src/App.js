import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProfilePage, NoPage, LotSelectionPage, TicketsPage, CurrentReservationsPage, AuthPage, MakeReservationPage } from './pages'
import { Header, Footer } from './components'
import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Outlet } from 'react-router-dom';
import "./stylesheets/App.css"; // Styles for layout
import "./stylesheets/index.css"; // Global styles

export default function App() {
  // Layout component to provide a consistent structure for all pages
  function Layout() {
    return (
      <div className="app-wrapper">
        <Header /> {/* Header component */}
        <main className="page-content">
          <Outlet /> {/* This will render nested routes */}
        </main>
        <Footer /> {/* Footer component */}
      </div>
    );
  }
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/*" element={<AuthPage />} />
          {/* Protected route wrapper */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            {/* Route for the lot selection page, passing selectedLot and setSelectedLot as props */}
            <Route path="/home" element={<LotSelectionPage />} />
            {/* Route for the profile page */}
            <Route path="/profile" element={<ProfilePage />} />
            {/* Route for the tickets page */}
            <Route path="/tickets" element={<TicketsPage />} />
            {/* Route for the current reservations page */}
            <Route path="/reservations" element={<CurrentReservationsPage />} />
            {/* Route for making a reservation */}
            <Route path='/reservation' element={<MakeReservationPage />}/>
            {/* Fallback route for undefined paths */}
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
