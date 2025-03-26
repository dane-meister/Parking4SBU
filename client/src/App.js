import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProfilePage, NoPage, LotSelectionPage, TicketsPage, CurrentReservationsPage } from './pages'
import { Header, Footer } from './components'
import { useState } from 'react';
import "./stylesheets/App.css"; // Styles for layout
import "./stylesheets/index.css"; // Global styles

export default function App() {
  const [ selectedLot, setSelectedLot ] = useState(null);

  function Layout({ children }) {
    return (
      <div className="app-wrapper">
        <Header />
        <main className="page-content">
          {children}
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route index element={<LotSelectionPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/reservations" element={<CurrentReservationsPage />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
