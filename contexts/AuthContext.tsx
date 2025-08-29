
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

// Define the shape of the authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'grooya_auth_token';

/**
 * Provides authentication state and functions to the application.
 * This implementation uses localStorage to simulate a persistent user session.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
        return !!window.localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
        return false;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
        setIsAuthenticated(!!window.localStorage.getItem(AUTH_TOKEN_KEY));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = () => {
    try {
        window.localStorage.setItem(AUTH_TOKEN_KEY, 'mock_user_logged_in');
        setIsAuthenticated(true);
    } catch (error) {
        console.error("Could not set auth token in local storage", error);
    }
  };

  const logout = () => {
    try {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
        setIsAuthenticated(false);
    } catch (error) {
        console.error("Could not remove auth token from local storage", error);
    }
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
