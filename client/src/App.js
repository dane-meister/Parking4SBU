import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ProfilePage, NoPage, LotSelectionPage, TicketsPage, CurrentReservationsPage, AuthPage, MakeReservationPage, AdminPage } from './pages'
import { Header, Footer } from './components'
import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Outlet } from 'react-router-dom';
import { getInitialTimes } from './components/Header';
import "./stylesheets/App.css"; // Styles for layout
import "./stylesheets/index.css"; // Global styles

export default function App() {
  const [times, setTimes] = useState(getInitialTimes()); // shared time state

  // Layout component to provide a consistent structure for all pages
  function Layout() {
    const location = useLocation(); // Get the current location
    const isHome = location.pathname === "/home"; // Check if the current path is home
    return (
      <div className="app-wrapper">
        <Header times={times} setTimes={setTimes}/> {/* Header component */}
        <main className={`page-content ${isHome ? "home-padding" : "compact-padding"}`}>
          <Outlet context={{ times, setTimes }}/> {/* This will render nested routes */}
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
            {/* Route for the admin page */}
            <Route path="/admin" element={<AdminPage />} />
            {/* Fallback route for undefined paths */}
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
