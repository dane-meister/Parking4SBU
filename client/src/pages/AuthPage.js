import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';

export default function AuthPage() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Default to login if no subpath is matched */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
