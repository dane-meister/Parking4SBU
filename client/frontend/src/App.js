import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import NoPage from "./pages/NoPage";
import Header from "./components/Header";
import LotSelection from "./pages/LotSelection";
import Footer from "./components/Footer";
import "./stylesheets/App.css"; // Styles for layout
import "./stylesheets/index.css"; // Global styles

export default function App() {
  return (
    <BrowserRouter>
        <Header />
        <LotSelection />
        <Routes>
            <Route index element={<Home />} />          {/* "/" Route */}
            <Route path="/profile" element={<Profile />} />  {/* "/profile" Route */}
            <Route path="*" element={<NoPage />} />     {/* Catch-all for 404 pages */}
        </Routes>
        <Footer />
    </BrowserRouter>
  );
}
