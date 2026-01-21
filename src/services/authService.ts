/**
 * Authentication service for the Pasos app.
 * Handles login, registration, token refresh, logout, and user retrieval.
 *
 * Uses:
 * - apiClient for HTTP requests (with automatic token attachment)
 * - tokenStorage for storing/clearing authentication tokens
 */

import { apiClient } from './apiClient';
import { setTokens, clearTokens, getRefreshToken } from '@/utils/tokenStorage';
import type { AuthResponse, LoginPayload, RegisterPayload, ApiResponse } from '@/types/api';

/**
 * Authenticated user information
 */
export interface AuthUser {
  /** User's unique identifier */
  id: string;
  /** User's username */
  username: string;
  /** User's email address */
  email: string;
}

/**
 * Response from the refresh token endpoint
 */
interface RefreshTokenResponse {
  /** JWT access token */
  token: string;
  /** New refresh token */
  refreshToken: string;
}

/**
 * Response from the current user endpoint
 */
interface CurrentUserResponse {
  /** User information */
  user: AuthUser;
}

/**
 * Authentication service with methods for all auth-related operations
 */
export const authService = {
  /**
   * Authenticates a user with email and password.
   * On success, stores tokens and returns user information.
   *
   * @param credentials - Login credentials (email and password)
   * @returns Promise resolving to the authenticated user
   * @throws Error if authentication fails
   */
  login: async (credentials: LoginPayload): Promise<AuthUser> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

    if (!response.data.success) {
      throw new Error('Login failed');
    }

    const { token, user } = response.data.data;
    // AuthResponse may have refreshToken or assume we get one
    // Based on the backend pattern, we get token and possibly refreshToken
    const refreshToken = (response.data.data as { token: string; refreshToken?: string }).refreshToken || token;

    // Store tokens using tokenStorage
    await setTokens(token, refreshToken);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  },

  /**
   * Registers a new user.
   * On success, stores tokens and returns user information.
   *
   * @param data - Registration data (username, email, password)
   * @returns Promise resolving to the newly registered user
   * @throws Error if registration fails
   */
  register: async (data: RegisterPayload): Promise<AuthUser> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);

    if (!response.data.success) {
      throw new Error('Registration failed');
    }

    const { token, user } = response.data.data;
    // Store tokens - use token as refresh token if not provided separately
    const refreshToken = (response.data.data as { token: string; refreshToken?: string }).refreshToken || token;

    await setTokens(token, refreshToken);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  },

  /**
   * Attempts to refresh the access token using the stored refresh token.
   *
   * @returns Promise resolving to true if refresh succeeded, false otherwise
   */
  refreshToken: async (): Promise<boolean> => {
    try {
      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        return false;
      }

      const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
        '/auth/refresh',
        { refreshToken }
      );

      if (!response.data.success) {
        await clearTokens();
        return false;
      }

      const { token: newToken, refreshToken: newRefreshToken } = response.data.data;

      // Update stored tokens
      await setTokens(newToken, newRefreshToken);

      return true;
    } catch (error) {
      // On any error, clear tokens and return false
      await clearTokens();
      return false;
    }
  },

  /**
   * Logs out the current user.
   * Clears stored tokens and optionally notifies the server.
   *
   * @returns Promise resolving when logout is complete
   */
  logout: async (): Promise<void> => {
    try {
      // Optionally notify the server (fire and forget)
      // Server may invalidate the refresh token
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore errors - we still want to clear local tokens
    }

    // Always clear local tokens
    await clearTokens();
  },

  /**
   * Retrieves the current authenticated user's information.
   *
   * @returns Promise resolving to the user or null if not authenticated
   */
  getCurrentUser: async (): Promise<AuthUser | null> => {
    try {
      const response = await apiClient.get<ApiResponse<CurrentUserResponse>>('/auth/me');

      if (!response.data.success) {
        return null;
      }

      const { user } = response.data.data;

      return {
        id: user.id,
        username: user.username,
        email: user.email,
      };
    } catch {
      // Not authenticated or error - return null
      return null;
    }
  },
};

export default authService;
