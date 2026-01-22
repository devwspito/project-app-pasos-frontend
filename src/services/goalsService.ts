/**
 * Service for managing fitness goals.
 * Handles API calls for creating, updating, and tracking goals.
 */

import axios, { AxiosResponse } from 'axios';
import type {
  Goal,
  GoalId,
  CreateGoalInput,
  UpdateGoalInput,
  GoalSummary,
  Streak,
} from '../types/goal.types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * API response wrapper type
 */
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Goal history entry for tracking progress over time
 */
export interface GoalProgressEntry {
  date: string;
  value: number;
  percentage: number;
}

/**
 * Goal detail response with full history
 */
export interface GoalDetailResponse {
  goal: Goal;
  progressHistory: GoalProgressEntry[];
  streak: Streak;
}

/**
 * Goals service for managing fitness goals
 */
export const goalsService = {
  /**
   * Get all goals for the current user
   */
  async getGoals(): Promise<Goal[]> {
    const response: AxiosResponse<ApiResponse<Goal[]>> = await axios.get(
      `${API_BASE}/goals`
    );
    return response.data.data;
  },

  /**
   * Get a specific goal by ID with full details
   */
  async getGoalById(goalId: GoalId): Promise<GoalDetailResponse> {
    const response: AxiosResponse<ApiResponse<GoalDetailResponse>> = await axios.get(
      `${API_BASE}/goals/${goalId}`
    );
    return response.data.data;
  },

  /**
   * Create a new goal
   */
  async createGoal(input: CreateGoalInput): Promise<Goal> {
    const response: AxiosResponse<ApiResponse<Goal>> = await axios.post(
      `${API_BASE}/goals`,
      input
    );
    return response.data.data;
  },

  /**
   * Update an existing goal
   */
  async updateGoal(goalId: GoalId, input: UpdateGoalInput): Promise<Goal> {
    const response: AxiosResponse<ApiResponse<Goal>> = await axios.put(
      `${API_BASE}/goals/${goalId}`,
      input
    );
    return response.data.data;
  },

  /**
   * Get goals summary for dashboard
   */
  async getGoalsSummary(): Promise<GoalSummary> {
    const response: AxiosResponse<ApiResponse<GoalSummary>> = await axios.get(
      `${API_BASE}/goals/summary`
    );
    return response.data.data;
  },

  /**
   * Get user's streak information
   */
  async getStreak(): Promise<Streak> {
    const response: AxiosResponse<ApiResponse<Streak>> = await axios.get(
      `${API_BASE}/goals/streak`
    );
    return response.data.data;
  },

  /**
   * Mark a goal as completed
   */
  async completeGoal(goalId: GoalId): Promise<Goal> {
    const response: AxiosResponse<ApiResponse<Goal>> = await axios.post(
      `${API_BASE}/goals/${goalId}/complete`
    );
    return response.data.data;
  },

  /**
   * Pause a goal
   */
  async pauseGoal(goalId: GoalId): Promise<Goal> {
    const response: AxiosResponse<ApiResponse<Goal>> = await axios.post(
      `${API_BASE}/goals/${goalId}/pause`
    );
    return response.data.data;
  },

  /**
   * Resume a paused goal
   */
  async resumeGoal(goalId: GoalId): Promise<Goal> {
    const response: AxiosResponse<ApiResponse<Goal>> = await axios.post(
      `${API_BASE}/goals/${goalId}/resume`
    );
    return response.data.data;
  },
};

export type { Goal, GoalId, CreateGoalInput, UpdateGoalInput, GoalSummary, Streak };
