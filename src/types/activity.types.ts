/**
 * Activity and step tracking related TypeScript types for the Pasos app.
 * Defines step records, activity sessions, and tracking data.
 */

import type { UserId } from './user.types';

/**
 * Activity record identifier
 */
export type ActivityId = string;

/**
 * Types of physical activities tracked
 */
export type ActivityType = 'walking' | 'running' | 'hiking' | 'cycling' | 'other';

/**
 * Time period granularity for statistics
 */
export type TimePeriod = 'day' | 'week' | 'month' | 'year' | 'all_time';

/**
 * Single step record entry
 */
export interface StepRecord {
  /** Unique identifier for the record */
  id: ActivityId;
  /** User who recorded these steps */
  userId: UserId;
  /** Number of steps recorded */
  stepCount: number;
  /** Date of the record (ISO 8601 date format: YYYY-MM-DD) */
  date: string;
  /** Start time of recording period (ISO 8601 timestamp) */
  startTime?: string;
  /** End time of recording period (ISO 8601 timestamp) */
  endTime?: string;
  /** Distance covered in meters */
  distanceMeters?: number;
  /** Calories burned */
  caloriesBurned?: number;
  /** Activity type */
  activityType: ActivityType;
  /** Source of the data (e.g., 'manual', 'phone_sensor', 'watch') */
  source: string;
  /** Record creation timestamp */
  createdAt: string;
}

/**
 * Daily step summary
 */
export interface DailyStepSummary {
  /** Date of the summary (ISO 8601 date format: YYYY-MM-DD) */
  date: string;
  /** Total steps for the day */
  totalSteps: number;
  /** Daily goal for that day */
  goalSteps: number;
  /** Whether the goal was achieved */
  goalAchieved: boolean;
  /** Percentage of goal completed (0-100+) */
  goalPercentage: number;
  /** Total distance in meters */
  totalDistanceMeters: number;
  /** Total calories burned */
  totalCalories: number;
  /** Most common activity type for the day */
  primaryActivityType: ActivityType;
  /** Number of active minutes */
  activeMinutes: number;
}

/**
 * Weekly step statistics
 */
export interface WeeklyStats {
  /** Start date of the week (ISO 8601 date format) */
  weekStartDate: string;
  /** End date of the week (ISO 8601 date format) */
  weekEndDate: string;
  /** Daily summaries for each day of the week */
  dailySummaries: DailyStepSummary[];
  /** Total steps for the week */
  totalSteps: number;
  /** Average daily steps */
  averageDailySteps: number;
  /** Number of days goal was achieved */
  daysGoalAchieved: number;
  /** Best day (highest steps) */
  bestDay: DailyStepSummary | null;
  /** Total distance for the week in meters */
  totalDistanceMeters: number;
  /** Total calories burned for the week */
  totalCalories: number;
}

/**
 * Activity session (continuous tracking period)
 */
export interface ActivitySession {
  /** Unique session identifier */
  id: ActivityId;
  /** User ID */
  userId: UserId;
  /** Type of activity */
  activityType: ActivityType;
  /** Session start time (ISO 8601 timestamp) */
  startTime: string;
  /** Session end time (ISO 8601 timestamp), null if ongoing */
  endTime: string | null;
  /** Duration in seconds */
  durationSeconds: number;
  /** Steps during this session */
  stepCount: number;
  /** Distance in meters */
  distanceMeters: number;
  /** Calories burned */
  caloriesBurned: number;
  /** Average pace (minutes per kilometer) */
  averagePaceMinPerKm?: number;
  /** Whether the session is currently active */
  isActive: boolean;
  /** Optional notes about the session */
  notes?: string;
}

/**
 * Step count for a specific hour (for hourly charts)
 */
export interface HourlySteps {
  /** Hour of the day (0-23) */
  hour: number;
  /** Step count for that hour */
  steps: number;
}

/**
 * Current day live tracking state
 */
export interface LiveTrackingState {
  /** Current total steps for today */
  currentSteps: number;
  /** Today's goal */
  goalSteps: number;
  /** Current active session (if any) */
  activeSession: ActivitySession | null;
  /** Last sync timestamp */
  lastSyncTime: string;
  /** Whether tracking is enabled */
  isTrackingEnabled: boolean;
  /** Hourly breakdown for today */
  hourlySteps: HourlySteps[];
}

/**
 * Step data for chart visualization
 */
export interface StepChartData {
  /** Labels for the x-axis (dates or hours) */
  labels: string[];
  /** Step counts corresponding to labels */
  values: number[];
  /** Goal line value */
  goalValue: number;
}
