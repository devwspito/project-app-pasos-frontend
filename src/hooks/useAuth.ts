import { useContext } from 'react';
import AuthContext, { AuthContextType } from '../contexts/AuthContext';

/**
 * Hook to access the authentication context.
 * Must be used within an AuthProvider.
 *
 * @returns The authentication context with user, isAuthenticated, and auth methods
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
