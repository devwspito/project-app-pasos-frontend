/**
 * Central export file for all utility modules.
 */

export {
  isNative,
  isIOS,
  isAndroid,
  isWeb,
  getPlatform,
  setStatusBarStyle,
  hideSplashScreen,
  getNetworkStatus,
  type Platform,
  type NetworkStatusResult,
} from './platform';

export {
  getToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  tokenStorage,
} from './tokenStorage';

export {
  isHealthAvailable,
  requestHealthPermissions,
  getTodaySteps,
  getStepsForDateRange,
  type StepData,
} from './health';
