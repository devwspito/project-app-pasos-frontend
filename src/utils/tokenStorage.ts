/**
 * Token storage utility for authentication.
 *
 * Uses @capacitor/preferences on native platforms (iOS/Android)
 * and localStorage on web platforms.
 *
 * This provides a consistent API for storing and retrieving
 * authentication tokens across all platforms.
 */

import { Preferences } from '@capacitor/preferences';
import { isNative } from './platform';

/**
 * Storage keys for authentication tokens
 */
const TOKEN_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
} as const;

/**
 * Retrieves the access token from storage.
 * Uses Capacitor Preferences on native, localStorage on web.
 *
 * @returns Promise resolving to the access token or null if not found
 */
export const getToken = async (): Promise<string | null> => {
  if (isNative()) {
    const { value } = await Preferences.get({ key: TOKEN_KEYS.ACCESS_TOKEN });
    return value;
  }

  // Web platform - use localStorage
  return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
};

/**
 * Retrieves the refresh token from storage.
 * Uses Capacitor Preferences on native, localStorage on web.
 *
 * @returns Promise resolving to the refresh token or null if not found
 */
export const getRefreshToken = async (): Promise<string | null> => {
  if (isNative()) {
    const { value } = await Preferences.get({ key: TOKEN_KEYS.REFRESH_TOKEN });
    return value;
  }

  // Web platform - use localStorage
  return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
};

/**
 * Stores both access and refresh tokens.
 * Uses Capacitor Preferences on native, localStorage on web.
 *
 * @param accessToken - The JWT access token to store
 * @param refreshToken - The refresh token to store
 */
export const setTokens = async (
  accessToken: string,
  refreshToken: string
): Promise<void> => {
  if (isNative()) {
    await Promise.all([
      Preferences.set({ key: TOKEN_KEYS.ACCESS_TOKEN, value: accessToken }),
      Preferences.set({ key: TOKEN_KEYS.REFRESH_TOKEN, value: refreshToken }),
    ]);
    return;
  }

  // Web platform - use localStorage
  localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
};

/**
 * Clears all authentication tokens from storage.
 * Uses Capacitor Preferences on native, localStorage on web.
 */
export const clearTokens = async (): Promise<void> => {
  if (isNative()) {
    await Promise.all([
      Preferences.remove({ key: TOKEN_KEYS.ACCESS_TOKEN }),
      Preferences.remove({ key: TOKEN_KEYS.REFRESH_TOKEN }),
    ]);
    return;
  }

  // Web platform - use localStorage
  localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
};

/**
 * Token storage service object for convenient importing
 */
export const tokenStorage = {
  getToken,
  getRefreshToken,
  setTokens,
  clearTokens,
};

export default tokenStorage;
