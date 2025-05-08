import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
// const HOST = "http://localhost:8000"
const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000"; // Use environment variable for API URL

// Create a context for authentication
const AuthContext = createContext();

// Toggle this to true during development to bypass login
const DEV_BYPASS_AUTH = false;

export const AuthProvider = ({ children }) => {
    // State to store the authenticated user
    const [user, setUser] = useState(null);
    // State to track whether authentication is still loading
    const [authLoading, setAuthLoading] = useState(true);

    // Function to handle user login
    const login = async (email, password) => {
        try {
            // Send login request to the backend
            await axios.post(`${HOST}/api/auth/login`, {
                email,
                password
            }, {
                withCredentials: true // Include cookies in the request
            });

            // Verify the login and fetch user data
            const user = await checkAuth();
            return { success: true, user }; // Return true if login was successful
        } catch (err) {
            const message = err.response?.data?.message || "Login failed"; // Extract error message from response
            console.error("Login error:", message|| err.message);
            return { success: false, message }; // Return message if login failed
        }
    };

    // Function to handle user logout
    const logout = async () => {
        // Send logout request to the backend
        await axios.post(`${HOST}/api/auth/logout`, {}, { withCredentials: true });
        setUser(null); // Clear the user state
    };

    // Function to check if the user is authenticated
    const checkAuth = async () => {
        if (DEV_BYPASS_AUTH) {
            // If bypassing authentication, set a fake user
            const fakeUser = { email: "dev@example.com", user_type: "developer" };
            setUser(fakeUser);
            return fakeUser; // Return the fake user
        }

        try {
            // Fetch the authenticated user's data from the backend
            const res = await axios.get(`${HOST}/api/auth/me`, {
                withCredentials: true // Include cookies in the request
            });
            
            setUser(res.data.user); // Set the user state with the fetched data
            return res.data.user; // Return the user data
        } catch(err) {
            console.warn("Auth expired or invalid:", err?.response?.status);
            setUser(null); // Clear the user state if authentication fails
            return null; // Return null if authentication fails
        }
    };

    // Run the authentication check when the component mounts
    useEffect(() => {
        checkAuth().finally(() => setAuthLoading(false)); // Set loading to false after the check

        const interval = setInterval(() => {
            checkAuth();
        }, 30 * 1000); // every 5 minutes
    
        return () => clearInterval(interval);
    }, []);

    // Determine if the user is authenticated
    const isAuthenticated = DEV_BYPASS_AUTH || !!user;

    return (
        // Provide the authentication context to child components
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);


