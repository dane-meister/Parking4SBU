import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProfilePage, NoPage, LotSelectionPage, TicketsPage, CurrentReservationsPage, ReservationPage } from './pages'
import { Header, Footer } from './components'
import { useState } from 'react';
import "./stylesheets/App.css"; // Styles for layout
import "./stylesheets/index.css"; // Global styles

export default function App() {
  // State to manage the selected parking lot
  const [ selectedLot, setSelectedLot ] = useState(null);

  // Layout component to provide a consistent structure for all pages
  function Layout({ children }) {
    return (
      <div className="app-wrapper">
        <Header /> {/* Header component */}
        <main className="page-content">
          {children} {/* Render the child components */}
        </main>
        <Footer /> {/* Footer component */}
      </div>
    );
  }
  
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Route for the lot selection page, passing selectedLot and setSelectedLot as props */}
          <Route index element={<LotSelectionPage selectedLot={selectedLot} setSelectedLot={setSelectedLot} />} />
          {/* Route for making a reservation */}
          <Route path='/reservation' element={<ReservationPage />}/>
          {/* Route for the profile page */}
          <Route path="/profile" element={<ProfilePage />} />
          {/* Route for the tickets page */}
          <Route path="/tickets" element={<TicketsPage />} />
          {/* Route for the current reservations page */}
          <Route path="/reservations" element={<CurrentReservationsPage />} />
          {/* Fallback route for undefined paths */}
          <Route path="*" element={<NoPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
