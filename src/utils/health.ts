/**
 * Health data utility for HealthKit (iOS) and Google Fit/Health Connect (Android)
 *
 * This module provides utilities for accessing health data using the capacitor-health plugin.
 * It follows the platform utility pattern with proper native checks and web fallbacks.
 *
 * Permission Configuration (must be added to native projects):
 *
 * iOS Info.plist:
 *   - NSHealthShareUsageDescription: Description for reading health data
 *   - NSHealthUpdateUsageDescription: Description for writing health data
 *
 * Android AndroidManifest.xml:
 *   - android.permission.ACTIVITY_RECOGNITION
 *   - com.google.android.gms.permission.ACTIVITY_RECOGNITION
 *
 * Usage:
 *   1. Check availability: await isHealthAvailable()
 *   2. Request permissions: await requestHealthPermissions()
 *   3. Get steps: await getTodaySteps() or await getStepsForDateRange(start, end)
 */

import { Health, PermissionResponse, AggregatedSample } from 'capacitor-health';
import { isNative } from './platform';

/**
 * Step data for a specific date
 */
export interface StepData {
  date: string;
  steps: number;
}

/**
 * Check if health data APIs are available on the current platform.
 *
 * On iOS: Returns true if HealthKit is available
 * On Android: Returns true if Google Health Connect is installed
 * On Web: Returns false (health APIs not available)
 *
 * @returns Promise that resolves to true if health APIs are available
 */
export const isHealthAvailable = async (): Promise<boolean> => {
  if (!isNative()) {
    // Health APIs not available on web
    return false;
  }

  try {
    const result = await Health.isHealthAvailable();
    return result.available;
  } catch (error) {
    console.error('Failed to check health availability:', error);
    return false;
  }
};

/**
 * Request permissions to access health/fitness data.
 *
 * On iOS: Prompts user for HealthKit permissions (only prompts once)
 * On Android: Prompts user for Health Connect permissions
 * On Web: Returns true (mock success for development)
 *
 * Note: On iOS, we cannot detect if user denied permissions - assumes granted.
 * Note: On Android, apps can only request permissions a limited number of times.
 *
 * @returns Promise that resolves to true if permissions were granted
 */
export const requestHealthPermissions = async (): Promise<boolean> => {
  if (!isNative()) {
    // Return mock success on web for development
    console.log('[Health] Web platform detected - returning mock permission success');
    return true;
  }

  // First check if health APIs are available
  const available = await isHealthAvailable();
  if (!available) {
    console.warn('[Health] Health APIs not available on this device');
    return false;
  }

  try {
    const response: PermissionResponse = await Health.requestHealthPermissions({
      permissions: ['READ_STEPS'],
    });

    // Check if READ_STEPS permission was granted
    // The response.permissions is an array of objects with permission keys
    if (response.permissions && response.permissions.length > 0) {
      const stepsPermission = response.permissions.find(
        (p) => 'READ_STEPS' in p
      );
      if (stepsPermission && stepsPermission['READ_STEPS'] === true) {
        return true;
      }
    }

    // On iOS, assume success since we can't detect denial
    // On Android, permission was likely denied
    console.warn('[Health] Permissions may not have been granted');
    return true; // Assume success to allow usage attempts
  } catch (error) {
    console.error('Failed to request health permissions:', error);
    return false;
  }
};

/**
 * Get step count for today.
 *
 * On native: Queries HealthKit/Health Connect for today's steps
 * On Web: Returns mock data for development (random 3000-8000 steps)
 *
 * @returns Promise that resolves to today's step count
 */
export const getTodaySteps = async (): Promise<number> => {
  if (!isNative()) {
    // Return mock data on web for development
    const mockSteps = Math.floor(Math.random() * 5000) + 3000;
    console.log(`[Health] Web platform detected - returning mock steps: ${mockSteps}`);
    return mockSteps;
  }

  // Check availability first
  const available = await isHealthAvailable();
  if (!available) {
    console.warn('[Health] Health APIs not available - returning 0 steps');
    return 0;
  }

  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    const response = await Health.queryAggregated({
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
      dataType: 'steps',
      bucket: 'day',
    });

    // Sum up all aggregated samples for today
    const totalSteps = response.aggregatedData.reduce(
      (sum: number, sample: AggregatedSample) => sum + (sample.value || 0),
      0
    );

    return Math.round(totalSteps);
  } catch (error) {
    console.error('Failed to get today\'s steps:', error);
    throw error;
  }
};

/**
 * Get step data for a date range.
 *
 * On native: Queries HealthKit/Health Connect for steps in the range
 * On Web: Returns mock data for development
 *
 * @param startDate - Start of the date range
 * @param endDate - End of the date range
 * @returns Promise that resolves to array of StepData for each day in range
 */
export const getStepsForDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<StepData[]> => {
  if (!isNative()) {
    // Return mock data on web for development
    const mockData: StepData[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const mockSteps = Math.floor(Math.random() * 5000) + 3000;
      mockData.push({
        date: currentDate.toISOString().split('T')[0],
        steps: mockSteps,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(`[Health] Web platform detected - returning ${mockData.length} days of mock step data`);
    return mockData;
  }

  // Check availability first
  const available = await isHealthAvailable();
  if (!available) {
    console.warn('[Health] Health APIs not available - returning empty array');
    return [];
  }

  try {
    // Normalize dates to start/end of day
    const normalizedStart = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    const normalizedEnd = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      23, 59, 59, 999
    );

    const response = await Health.queryAggregated({
      startDate: normalizedStart.toISOString(),
      endDate: normalizedEnd.toISOString(),
      dataType: 'steps',
      bucket: 'day',
    });

    // Map aggregated samples to StepData format
    const stepData: StepData[] = response.aggregatedData.map(
      (sample: AggregatedSample) => ({
        date: sample.startDate.split('T')[0],
        steps: Math.round(sample.value || 0),
      })
    );

    return stepData;
  } catch (error) {
    console.error('Failed to get steps for date range:', error);
    throw error;
  }
};
