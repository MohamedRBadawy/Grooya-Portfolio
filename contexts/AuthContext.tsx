
import React, { createContext, useContext, ReactNode } from 'react';

// Define the shape of the authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provides authentication state and functions to the application.
 * This implementation has been simplified to always treat the user as authenticated.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Authentication is now always true to hide the login page.
  const isAuthenticated = true;

  // Mock login/logout functions as they are no longer needed but might be called by other components.
  const login = () => {};
  const logout = () => {};

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
