import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../components/LoginPage';
import RegisterPage from '../components/RegisterPage';

export default function AuthPage() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Default to login if no subpath is matched */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
