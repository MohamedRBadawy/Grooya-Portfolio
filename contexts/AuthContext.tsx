/**
 * AuthContext owns Django session status and exposes login/register/logout
 * actions to the rest of the frontend.
 */
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { fetchSession, loginWithPassword, logoutSession, registerAccount } from '../services/platform/auth';

const SESSION_EVENT = 'grooya:session-changed';

interface AuthCredentials {
  email: string;
  password: string;
}

interface RegisterPayload extends AuthCredentials {
  name: string;
  title?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const dispatchSessionChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(SESSION_EVENT));
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    setIsLoading(true);
    try {
      const session = await fetchSession();
      setIsAuthenticated(Boolean(session.authenticated));
    } catch (error) {
      console.warn('Session bootstrap failed; treating the visitor as signed out.', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshSession();

    const handleSessionChanged = () => {
      void refreshSession();
    };

    window.addEventListener(SESSION_EVENT, handleSessionChanged);
    return () => window.removeEventListener(SESSION_EVENT, handleSessionChanged);
  }, []);

  const login = async (credentials: AuthCredentials) => {
    await loginWithPassword(credentials);
    setIsAuthenticated(true);
    dispatchSessionChanged();
  };

  const register = async (payload: RegisterPayload) => {
    await registerAccount(payload);
    setIsAuthenticated(true);
    dispatchSessionChanged();
  };

  const logout = async () => {
    await logoutSession();
    setIsAuthenticated(false);
    dispatchSessionChanged();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, register, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
