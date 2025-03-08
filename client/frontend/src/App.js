import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Profile, NoPage, LotSelection, Tickets} from './pages'
import { Header, Footer } from './components'
import "./stylesheets/App.css"; // Styles for layout
import "./stylesheets/index.css"; // Global styles

export default function App() {
  return (
    <BrowserRouter>
        <Header />
        <Routes>
            <Route index element={<LotSelection />} />          {/* "/" Route */}
            <Route path="/profile" element={<Profile />} />  {/* "/profile" Route */}
            <Route path="/tickets" element={<Tickets />} />  {/* "/tickets" Route */}
            <Route path="*" element={<NoPage />} />     {/* Catch-all for 404 pages */}
        </Routes>
        <Footer />
    </BrowserRouter>
  );
}
