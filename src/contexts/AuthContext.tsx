import React, { createContext, useState, useCallback, useMemo, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = useMemo(() => user !== null, [user]);

  const login = useCallback(async (email: string, _password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // Simulated login - in production, this would call the auth API
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUser({
        id: '1',
        email,
        name: email.split('@')[0],
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback((): void => {
    setUser(null);
  }, []);

  const register = useCallback(async (email: string, _password: string, name: string): Promise<void> => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // Simulated registration - in production, this would call the auth API
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUser({
        id: '1',
        email,
        name,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      register,
    }),
    [user, isAuthenticated, isLoading, login, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
