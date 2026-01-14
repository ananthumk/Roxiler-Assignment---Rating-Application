// FILE: src/context/storeContext.jsx (Updated)
import React, { useState, createContext, useEffect } from "react";

export const AppContext = createContext({
  url: '',
  currentUser: null,
  setCurrentUser: () => {},
  token: null,
  setToken: () => {}
});

export const AppProvider = ({ children }) => {
  // Initialize token from localStorage
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  // Initialize currentUser from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Save token to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Save currentUser to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Logout function (optional utility)
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  };

  return (
    <AppContext.Provider value={{ 
      url: 'https://roxiler-assignment-rating-application.onrender.com/api', 
      currentUser, 
      setCurrentUser, 
      token, 
      setToken,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};
