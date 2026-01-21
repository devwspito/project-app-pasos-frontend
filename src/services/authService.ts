/**
 * Authentication service for login, register, logout operations
 */

import { apiClient } from './apiClient';
import { setTokens, clearTokens, getRefreshToken } from '../utils/tokenStorage';

/**
 * Authenticated user data
 */
export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

/**
 * Login credentials
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

/**
 * Auth API response with tokens
 */
interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

/**
 * Login with email and password
 * @param credentials - Login credentials
 * @returns Authenticated user data
 */
const login = async (credentials: LoginPayload): Promise<AuthUser> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  const { user, accessToken, refreshToken } = response.data;
  await setTokens(accessToken, refreshToken);
  return user;
};

/**
 * Register a new user
 * @param data - Registration data
 * @returns Newly created user data
 */
const register = async (data: RegisterPayload): Promise<AuthUser> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  const { user, accessToken, refreshToken } = response.data;
  await setTokens(accessToken, refreshToken);
  return user;
};

/**
 * Refresh the access token
 * @returns true if refresh succeeded, false otherwise
 */
const refreshToken = async (): Promise<boolean> => {
  try {
    const refresh = await getRefreshToken();
    if (!refresh) {
      return false;
    }

    const response = await apiClient.post<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh',
      { refreshToken: refresh }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    await setTokens(accessToken, newRefreshToken);
    return true;
  } catch (error) {
    await clearTokens();
    return false;
  }
};

/**
 * Logout the current user
 * Clears tokens regardless of server response
 */
const logout = async (): Promise<void> => {
  try {
    // Optionally notify server
    await apiClient.post('/auth/logout');
  } catch {
    // Ignore server errors during logout
  } finally {
    await clearTokens();
  }
};

/**
 * Get the current authenticated user
 * @returns User data or null if not authenticated
 */
const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const response = await apiClient.get<{ user: AuthUser }>('/auth/me');
    return response.data.user;
  } catch {
    return null;
  }
};

export const authService = {
  login,
  register,
  refreshToken,
  logout,
  getCurrentUser,
};
