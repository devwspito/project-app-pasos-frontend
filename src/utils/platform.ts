/**
 * Platform detection utility for Capacitor
 *
 * This module provides utilities for detecting the current platform (web, iOS, Android)
 * and safely accessing Capacitor plugins with proper platform checks.
 *
 * Usage:
 * - Import platform detection functions to conditionally run native code
 * - Import plugin wrapper functions to safely call native APIs
 */

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Network, ConnectionStatus } from '@capacitor/network';

/**
 * Platform type definition
 */
export type Platform = 'ios' | 'android' | 'web';

/**
 * Check if running on a native platform (iOS or Android)
 * @returns true if running on iOS or Android, false if running on web
 */
export const isNative = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Check if running on iOS
 * @returns true if running on iOS
 */
export const isIOS = (): boolean => {
  return Capacitor.getPlatform() === 'ios';
};

/**
 * Check if running on Android
 * @returns true if running on Android
 */
export const isAndroid = (): boolean => {
  return Capacitor.getPlatform() === 'android';
};

/**
 * Check if running on web
 * @returns true if running in a web browser
 */
export const isWeb = (): boolean => {
  return Capacitor.getPlatform() === 'web';
};

/**
 * Get the current platform
 * @returns 'ios', 'android', or 'web'
 */
export const getPlatform = (): Platform => {
  return Capacitor.getPlatform() as Platform;
};

/**
 * Set the status bar style (light or dark)
 * Only works on native platforms, silently skips on web.
 *
 * @param style - 'light' for light content (dark background) or 'dark' for dark content (light background)
 */
export const setStatusBarStyle = async (style: 'light' | 'dark'): Promise<void> => {
  if (!isNative()) {
    // Silently skip on web
    return;
  }

  try {
    await StatusBar.setStyle({
      style: style === 'light' ? Style.Light : Style.Dark,
    });
  } catch (error) {
    console.error('Failed to set status bar style:', error);
    throw error;
  }
};

/**
 * Hide the splash screen
 * Only works on native platforms, silently skips on web.
 */
export const hideSplashScreen = async (): Promise<void> => {
  if (!isNative()) {
    // Silently skip on web
    return;
  }

  try {
    await SplashScreen.hide();
  } catch (error) {
    console.error('Failed to hide splash screen:', error);
    throw error;
  }
};

/**
 * Network status result type
 */
export interface NetworkStatusResult {
  connected: boolean;
  connectionType: string;
}

/**
 * Get the current network status
 * Works on all platforms (web uses navigator.onLine fallback).
 *
 * @returns Object with connected status and connection type
 */
export const getNetworkStatus = async (): Promise<NetworkStatusResult> => {
  try {
    const status: ConnectionStatus = await Network.getStatus();
    return {
      connected: status.connected,
      connectionType: status.connectionType,
    };
  } catch (error) {
    console.error('Failed to get network status:', error);
    // Fallback for web when plugin fails
    if (isWeb() && typeof navigator !== 'undefined') {
      return {
        connected: navigator.onLine,
        connectionType: navigator.onLine ? 'unknown' : 'none',
      };
    }
    throw error;
  }
};
