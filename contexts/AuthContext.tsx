
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Define the shape of the authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the key for storing auth status in local storage
const AUTH_STORAGE_KEY = 'grooya_auth_status';

/**
 * Provides authentication state and functions to the application.
 * This is a mock implementation that uses localStorage for persistence.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize isAuthenticated state from localStorage or default to false
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
      return stored === 'true';
    } catch {
      return false;
    }
  });

  // Effect to persist the authentication status to localStorage whenever it changes
  useEffect(() => {
    try {
      window.localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthenticated));
    } catch (error) {
      console.error("Error writing auth status to local storage", error);
    }
  }, [isAuthenticated]);

  // Mock login function
  const login = () => {
    setIsAuthenticated(true);
  };

  // Mock logout function
  const logout = () => {
    setIsAuthenticated(false);
  };

  // Provide the state and functions to children components
  const value = { isAuthenticated, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to easily access the authentication context.
 * Throws an error if used outside of an AuthProvider.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};