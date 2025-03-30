import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Toggle this to true during development to bypass login
const DEV_BYPASS_AUTH = false;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  // Override authentication if in dev mode
  const isAuthenticated = DEV_BYPASS_AUTH || !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
