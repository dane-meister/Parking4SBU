import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Toggle this to true during development to bypass login
const DEV_BYPASS_AUTH = false;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    if (DEV_BYPASS_AUTH) {
      const fakeUser = { email, user_type: 'developer' };
      setUser(fakeUser);
      return { token: 'dev-token', user: fakeUser };
    }

    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password
      });

      const { token } = res.data;

      // Decode token to get user info (assuming it's a JWT)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userData = {
        email: payload.email,
        user_type: payload.user_type,
        user_id: payload.user_id
      };

      setUser(userData);
      return { token, user: userData };

    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      return null;
    }
  };

  const logout = () => setUser(null);

  const isAuthenticated = DEV_BYPASS_AUTH || !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

