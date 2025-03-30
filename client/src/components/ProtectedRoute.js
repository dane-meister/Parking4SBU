import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) return null; // or show spinner

  return isAuthenticated
    ? (children || <Outlet />)
    : <Navigate to="/auth/login" replace />;
}
