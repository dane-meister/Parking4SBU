import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Profile, NoPage, LotSelection, Tickets} from './pages'
import { Header, Footer } from './components'
import { useState } from 'react';
import "./stylesheets/App.css"; // Styles for layout
import "./stylesheets/index.css"; // Global styles

export default function App() {
  const [ selectedLot, setSelectedLot ] = useState(null);

  return (
    <BrowserRouter>
      <Header selectedLot={selectedLot} setSelectedLot={setSelectedLot} />
      <Routes>
        <Route index element={<LotSelection selectedLot={selectedLot} setSelectedLot={setSelectedLot}/>} />          {/* "/" Route */}
        <Route path="/profile" element={<Profile />} />  {/* "/profile" Route */}
        <Route path="/tickets" element={<Tickets />} />  {/* "/tickets" Route */}
        <Route path="*" element={<NoPage />} />     {/* Catch-all for 404 pages */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
