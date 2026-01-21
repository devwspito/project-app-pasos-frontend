/**
 * Custom hook for fetching and managing step data.
 * Provides a unified interface to access today's steps, weekly trends,
 * hourly peaks, and overall statistics.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  stepsService,
  TodayStepsData,
  WeeklyTrendItem,
  HourlyPeakItem,
  StepStatsData,
  StepSource,
  RecordedStep,
} from '@/services/stepsService';

/**
 * Return type for the useSteps hook
 */
export interface UseStepsReturn {
  /** Today's step data (total and date) */
  todaySteps: TodayStepsData | null;
  /** Weekly trend data (array of daily totals) */
  weeklyTrend: WeeklyTrendItem[];
  /** Hourly peaks data (array of hourly totals) */
  hourlyPeaks: HourlyPeakItem[];
  /** Step statistics (today, week, month, allTime) */
  stats: StepStatsData | null;
  /** Whether data is currently loading */
  loading: boolean;
  /** Error message if any request failed */
  error: string | null;
  /** Refetch all step data */
  refetch: () => Promise<void>;
  /** Record new steps */
  recordSteps: (count: number, source: StepSource) => Promise<RecordedStep | null>;
  /** Fetch hourly peaks for a specific date */
  fetchHourlyPeaks: (date: string) => Promise<void>;
}

/**
 * Custom hook for managing step data.
 *
 * @param autoFetch - Whether to automatically fetch data on mount (default: true)
 * @returns Object containing step data, loading state, error state, and actions
 *
 * @example
 * ```tsx
 * const { todaySteps, loading, error, refetch } = useSteps();
 *
 * if (loading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage message={error} />;
 *
 * return <div>Today: {todaySteps?.total} steps</div>;
 * ```
 */
export function useSteps(autoFetch = true): UseStepsReturn {
  const [todaySteps, setTodaySteps] = useState<TodayStepsData | null>(null);
  const [weeklyTrend, setWeeklyTrend] = useState<WeeklyTrendItem[]>([]);
  const [hourlyPeaks, setHourlyPeaks] = useState<HourlyPeakItem[]>([]);
  const [stats, setStats] = useState<StepStatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all step data from the API
   */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [todayRes, weeklyRes, hourlyRes, statsRes] = await Promise.all([
        stepsService.getTodaySteps(),
        stepsService.getWeeklyTrend(),
        stepsService.getHourlyPeaks(),
        stepsService.getStats(),
      ]);

      // Extract data from API responses
      if (todayRes.data.success) {
        setTodaySteps(todayRes.data.data);
      }
      if (weeklyRes.data.success) {
        setWeeklyTrend(weeklyRes.data.data.trend);
      }
      if (hourlyRes.data.success) {
        setHourlyPeaks(hourlyRes.data.data.peaks);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch steps data';
      setError(errorMessage);
      console.error('useSteps fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch hourly peaks for a specific date
   */
  const fetchHourlyPeaks = useCallback(async (date: string) => {
    try {
      const response = await stepsService.getHourlyPeaks(date);
      if (response.data.success) {
        setHourlyPeaks(response.data.data.peaks);
      }
    } catch (err) {
      console.error('Failed to fetch hourly peaks:', err);
    }
  }, []);

  /**
   * Record new steps and refetch data
   */
  const recordSteps = useCallback(
    async (count: number, source: StepSource): Promise<RecordedStep | null> => {
      try {
        const response = await stepsService.recordSteps(count, source);
        if (response.data.success) {
          // Refetch all data after recording new steps
          await fetchAll();
          return response.data.data.step;
        }
        return null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to record steps';
        setError(errorMessage);
        console.error('recordSteps error:', err);
        return null;
      }
    },
    [fetchAll]
  );

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchAll();
    }
  }, [autoFetch, fetchAll]);

  return {
    todaySteps,
    weeklyTrend,
    hourlyPeaks,
    stats,
    loading,
    error,
    refetch: fetchAll,
    recordSteps,
    fetchHourlyPeaks,
  };
}

export default useSteps;
