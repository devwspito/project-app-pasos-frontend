/**
 * Token storage utility for auth tokens
 * Uses Capacitor Preferences for native (iOS/Android) and localStorage for web
 */

import { Preferences } from '@capacitor/preferences';
import { isNative } from './platform';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

/**
 * Get the access token
 */
export const getToken = async (): Promise<string | null> => {
  if (isNative()) {
    const { value } = await Preferences.get({ key: ACCESS_TOKEN_KEY });
    return value;
  }
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get the refresh token
 */
export const getRefreshToken = async (): Promise<string | null> => {
  if (isNative()) {
    const { value } = await Preferences.get({ key: REFRESH_TOKEN_KEY });
    return value;
  }
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Store both access and refresh tokens
 */
export const setTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  if (isNative()) {
    await Preferences.set({ key: ACCESS_TOKEN_KEY, value: accessToken });
    await Preferences.set({ key: REFRESH_TOKEN_KEY, value: refreshToken });
  } else {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

/**
 * Clear all stored tokens
 */
export const clearTokens = async (): Promise<void> => {
  if (isNative()) {
    await Preferences.remove({ key: ACCESS_TOKEN_KEY });
    await Preferences.remove({ key: REFRESH_TOKEN_KEY });
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const tokenStorage = {
  getToken,
  getRefreshToken,
  setTokens,
  clearTokens,
};
