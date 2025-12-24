import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Initial Load (Check if logged in)
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser._id || parsedUser.userId || parsedUser.id;

        // 🔥 IMPORTANT: Server se latest data fetch karo (Refresh fix)
        if (userId) {
          try {
            const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
            setUser(res.data); // Fresh data set karo
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(res.data)); // Local storage update karo
          } catch (err) {
            console.error("Session Expired or User Error:", err);
            // Agar error aaye toh logout mat karo, bas stored data use kar lo (fallback)
            setUser(parsedUser);
            setIsAuthenticated(true);
          }
        } else {
            setUser(parsedUser);
            setIsAuthenticated(true);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // 2. Login Function
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // 3. Logout Function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Agar token use kar rahe ho
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);