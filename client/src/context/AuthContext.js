import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Toggle this to true during development to bypass login
const DEV_BYPASS_AUTH = false;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const login = async (email, password) => {
    try {
      await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password
      }, {
        withCredentials: true
      });

      const success = await checkAuth(); // verify cookie and fetch user
      return success; // return true if login was successful and user is fetched 
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      return null;
    }
  };

  const logout = async () => {
    await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
  };

  const checkAuth = async () => {
    if (DEV_BYPASS_AUTH) {
      const fakeUser = { email: "dev@example.com", user_type: "developer" };
      setUser(fakeUser);
      return true;
    }

    try {
      const res = await axios.get("http://localhost:8000/api/auth/me", {
        withCredentials: true
      });
      console.log("Authenticated user data:", res.data.user); // Log the user data for debugging
      setUser(res.data.user);
      return true;
    } catch {
      setUser(null);
      return false;
    }
  };

  useEffect(() => {
    checkAuth().finally(() => setAuthLoading(false));
  }, []);

  const isAuthenticated = DEV_BYPASS_AUTH || !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


