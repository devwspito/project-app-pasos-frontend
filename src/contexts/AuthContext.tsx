import React, { createContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { authService, type AuthUser } from '../services/authService';
import { tokenStorage } from '../utils/tokenStorage';

/**
 * User type - maps from AuthUser for context consumers
 */
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Convert AuthUser from API to internal User format
 */
const mapAuthUserToUser = (authUser: AuthUser): User => ({
  id: authUser.id,
  email: authUser.email,
  name: authUser.username,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start true for initialization
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = useMemo(() => user !== null, [user]);

  // Initialize auth state on mount - check for existing token
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const token = await tokenStorage.getToken();
        if (token) {
          const authUser = await authService.getCurrentUser();
          if (authUser) {
            setUser(mapAuthUserToUser(authUser));
          }
        }
      } catch {
        // Token invalid or expired, clear it
        await tokenStorage.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const authUser = await authService.login({ email, password });
      setUser(mapAuthUserToUser(authUser));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const authUser = await authService.register({ username: name, email, password });
      setUser(mapAuthUserToUser(authUser));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
      register,
      clearError,
    }),
    [user, isAuthenticated, isLoading, error, login, logout, register, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
