/**
 * Goals API service for the Pasos app.
 * Handles all goal-related API calls using axios.
 */

import axios from 'axios';
import type { ApiResponse } from '@/types';
import type {
  Goal,
  CreateGoalInput,
  UpdateGoalInput,
  GoalSummary,
} from '@/types/goal.types';

/**
 * Base URL for API requests - uses environment variable or defaults to localhost
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Get all goals response
 */
export interface GoalsListData {
  goals: Goal[];
}

/**
 * Get single goal response
 */
export interface GoalData {
  goal: Goal;
}

/**
 * Create/Update goal response
 */
export interface GoalMutationData {
  goal: Goal;
}

/**
 * Goal summary response
 */
export interface GoalSummaryData {
  summary: GoalSummary;
}

/**
 * Goals API service with methods for all goal-related operations
 */
export const goalsService = {
  /**
   * Get all goals for the current user
   * @param status - Optional filter by goal status
   * @returns Promise with array of goals
   */
  getGoals: (status?: string) =>
    axios.get<ApiResponse<GoalsListData>>(`${API_BASE}/goals`, {
      params: status ? { status } : undefined,
    }),

  /**
   * Get a single goal by ID
   * @param id - Goal ID
   * @returns Promise with the goal
   */
  getGoal: (id: string) =>
    axios.get<ApiResponse<GoalData>>(`${API_BASE}/goals/${id}`),

  /**
   * Get goal summary for dashboard
   * @returns Promise with goal summary data
   */
  getGoalSummary: () =>
    axios.get<ApiResponse<GoalSummaryData>>(`${API_BASE}/goals/summary`),

  /**
   * Create a new goal
   * @param data - Goal creation data
   * @returns Promise with the created goal
   */
  createGoal: (data: CreateGoalInput) =>
    axios.post<ApiResponse<GoalMutationData>>(`${API_BASE}/goals`, data),

  /**
   * Update an existing goal
   * @param id - Goal ID
   * @param data - Goal update data
   * @returns Promise with the updated goal
   */
  updateGoal: (id: string, data: UpdateGoalInput) =>
    axios.put<ApiResponse<GoalMutationData>>(`${API_BASE}/goals/${id}`, data),

  /**
   * Mark a goal as completed
   * @param id - Goal ID
   * @returns Promise with the updated goal
   */
  completeGoal: (id: string) =>
    axios.post<ApiResponse<GoalMutationData>>(`${API_BASE}/goals/${id}/complete`),

  /**
   * Pause a goal
   * @param id - Goal ID
   * @returns Promise with the updated goal
   */
  pauseGoal: (id: string) =>
    axios.post<ApiResponse<GoalMutationData>>(`${API_BASE}/goals/${id}/pause`),

  /**
   * Resume a paused goal
   * @param id - Goal ID
   * @returns Promise with the updated goal
   */
  resumeGoal: (id: string) =>
    axios.post<ApiResponse<GoalMutationData>>(`${API_BASE}/goals/${id}/resume`),
};

export default goalsService;
