/**
 * Steps API service for the Pasos app.
 * Handles all step-related API calls using axios.
 */

import axios from 'axios';
import type { ApiResponse } from '@/types';

/**
 * Base URL for API requests - uses environment variable or defaults to localhost
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Today's step count response data
 */
export interface TodayStepsData {
  /** Total steps for today */
  total: number;
  /** Date in ISO format (YYYY-MM-DD) */
  date: string;
}

/**
 * Single trend data point for weekly stats
 */
export interface WeeklyTrendItem {
  /** Date in ISO format (YYYY-MM-DD) */
  date: string;
  /** Total steps for that day */
  total: number;
}

/**
 * Weekly trend response data
 */
export interface WeeklyTrendData {
  /** Array of daily step totals for the week */
  trend: WeeklyTrendItem[];
}

/**
 * Single hourly peak data point
 */
export interface HourlyPeakItem {
  /** Hour of the day (0-23) */
  hour: number;
  /** Total steps for that hour */
  total: number;
}

/**
 * Hourly peaks response data
 */
export interface HourlyPeaksData {
  /** Array of hourly step totals */
  peaks: HourlyPeakItem[];
}

/**
 * Step statistics response data
 */
export interface StepStatsData {
  /** Total steps today */
  today: number;
  /** Total steps this week */
  week: number;
  /** Total steps this month */
  month: number;
  /** Total steps all time */
  allTime: number;
}

/**
 * Step source type
 */
export type StepSource = 'native' | 'manual' | 'web';

/**
 * Recorded step data (returned from POST)
 */
export interface RecordedStep {
  /** Step record ID */
  id: string;
  /** Number of steps recorded */
  count: number;
  /** Source of the steps */
  source: StepSource;
  /** Timestamp of recording */
  timestamp: string;
}

/**
 * Record steps response data
 */
export interface RecordStepsData {
  /** The created step record */
  step: RecordedStep;
}

/**
 * Steps API service with methods for all step-related operations
 */
export const stepsService = {
  /**
   * Get today's step count
   * @returns Promise with today's step total and date
   */
  getTodaySteps: () =>
    axios.get<ApiResponse<TodayStepsData>>(`${API_BASE}/steps/today`),

  /**
   * Get weekly step trend (last 7 days)
   * @returns Promise with array of daily step totals
   */
  getWeeklyTrend: () =>
    axios.get<ApiResponse<WeeklyTrendData>>(`${API_BASE}/steps/weekly`),

  /**
   * Get hourly step peaks for a specific date
   * @param date - Optional date in YYYY-MM-DD format (defaults to today)
   * @returns Promise with array of hourly step totals
   */
  getHourlyPeaks: (date?: string) =>
    axios.get<ApiResponse<HourlyPeaksData>>(`${API_BASE}/steps/hourly-peaks`, {
      params: date ? { date } : undefined,
    }),

  /**
   * Get step statistics (today, week, month, all-time)
   * @returns Promise with step statistics
   */
  getStats: () => axios.get<ApiResponse<StepStatsData>>(`${API_BASE}/steps/stats`),

  /**
   * Record new steps
   * @param count - Number of steps to record
   * @param source - Source of the steps ('native', 'manual', or 'web')
   * @returns Promise with the created step record
   */
  recordSteps: (count: number, source: StepSource) =>
    axios.post<ApiResponse<RecordStepsData>>(`${API_BASE}/steps`, { count, source }),
};

export default stepsService;
