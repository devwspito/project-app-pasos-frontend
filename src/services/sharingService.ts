/**
 * Sharing/Friends API service for the Pasos app.
 * Handles all friend-related API calls using axios.
 */

import axios from 'axios';
import type { ApiResponse } from '@/types';

/**
 * Base URL for API requests - uses environment variable or defaults to localhost
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Friend stats weekly trend item
 */
export interface FriendWeeklyTrendItem {
  /** Date in ISO format (YYYY-MM-DD) */
  date: string;
  /** Total steps for that day */
  total: number;
}

/**
 * Friend step statistics
 */
export interface FriendStatsData {
  /** Friend's user ID */
  friendId: string;
  /** Friend's name */
  friendName: string;
  /** Friend's avatar URL */
  avatarUrl?: string;
  /** Today's step count */
  todaySteps: number;
  /** Weekly trend data (last 7 days) */
  weeklyTrend: FriendWeeklyTrendItem[];
  /** Aggregated statistics */
  stats: {
    /** Total steps today */
    today: number;
    /** Total steps this week */
    week: number;
    /** Total steps this month */
    month: number;
    /** Total steps all time */
    allTime: number;
  };
  /** Friend's daily step goal (if set) */
  dailyGoal?: number;
}

/**
 * Sharing API service with methods for friend-related operations
 */
export const sharingService = {
  /**
   * Get a friend's step statistics
   * @param friendId - The friend's user ID
   * @returns Promise with friend's stats data
   */
  getFriendStats: (friendId: string) =>
    axios.get<ApiResponse<FriendStatsData>>(`${API_BASE}/sharing/${friendId}/stats`),
};

export default sharingService;
