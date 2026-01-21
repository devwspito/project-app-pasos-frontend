/**
 * Goals API service for the Pasos app.
 * Handles all goal-related API calls using axios.
 */

import axios from 'axios';
import type { ApiResponse } from '@/types';
import type { Goal, CreateGoalInput, UpdateGoalInput, GoalSummary } from '../types/goal.types';

/**
 * Base URL for API requests - uses environment variable or defaults to localhost
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Goals list response
 */
export interface GoalsListData {
  /** Array of goals */
  goals: Goal[];
  /** Total count */
  total: number;
}

/**
 * Single goal response
 */
export interface GoalData {
  /** The goal object */
  goal: Goal;
}

/**
 * Goals API service with methods for all goal-related operations
 */
export const goalsService = {
  /**
   * Get all goals for the current user
   * @param status - Optional filter by status
   * @returns Promise with array of goals
   */
  getGoals: (status?: string) =>
    axios.get<ApiResponse<GoalsListData>>(`${API_BASE}/goals`, {
      params: status ? { status } : undefined,
    }),

  /**
   * Get a single goal by ID
   * @param goalId - Goal ID
   * @returns Promise with the goal
   */
  getGoal: (goalId: string) =>
    axios.get<ApiResponse<GoalData>>(`${API_BASE}/goals/${goalId}`),

  /**
   * Create a new goal
   * @param input - Goal creation data
   * @returns Promise with the created goal
   */
  createGoal: (input: CreateGoalInput) =>
    axios.post<ApiResponse<GoalData>>(`${API_BASE}/goals`, input),

  /**
   * Update an existing goal
   * @param goalId - Goal ID
   * @param input - Goal update data
   * @returns Promise with the updated goal
   */
  updateGoal: (goalId: string, input: UpdateGoalInput) =>
    axios.put<ApiResponse<GoalData>>(`${API_BASE}/goals/${goalId}`, input),

  /**
   * Get goal summary (active count, completed count, primary goal, streak)
   * @returns Promise with goal summary
   */
  getSummary: () =>
    axios.get<ApiResponse<{ summary: GoalSummary }>>(`${API_BASE}/goals/summary`),
};

export default goalsService;
