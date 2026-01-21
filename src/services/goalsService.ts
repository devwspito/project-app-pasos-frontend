/**
 * Service for managing goals API interactions.
 * Handles CRUD operations for individual fitness goals.
 */

import axios, { AxiosResponse } from 'axios';
import type { Goal, CreateGoalInput, UpdateGoalInput, GoalSummary } from '../types/goal.types.ts';

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
 * Goals list response from API
 */
export interface GoalsListResponse {
  goals: Goal[];
  total: number;
}

/**
 * Goals service for managing fitness goals
 */
export const goalsService = {
  /**
   * Get all goals for the current user
   * @param status - Optional filter by goal status
   */
  async getGoals(status?: string): Promise<Goal[]> {
    const params = status ? { status } : {};
    const response: AxiosResponse<ApiResponse<GoalsListResponse>> = await axios.get(
      `${API_BASE}/goals`,
      { params }
    );
    return response.data.data.goals;
  },

  /**
   * Get a specific goal by ID
   */
  async getGoalById(goalId: string): Promise<Goal> {
    const response: AxiosResponse<ApiResponse<Goal>> = await axios.get(
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
  async updateGoal(goalId: string, input: UpdateGoalInput): Promise<Goal> {
    const response: AxiosResponse<ApiResponse<Goal>> = await axios.put(
      `${API_BASE}/goals/${goalId}`,
      input
    );
    return response.data.data;
  },

  /**
   * Get goal summary (for dashboard display)
   */
  async getGoalSummary(): Promise<GoalSummary> {
    const response: AxiosResponse<ApiResponse<GoalSummary>> = await axios.get(
      `${API_BASE}/goals/summary`
    );
    return response.data.data;
  },

  /**
   * Set a goal as primary
   */
  async setPrimaryGoal(goalId: string): Promise<Goal> {
    const response: AxiosResponse<ApiResponse<Goal>> = await axios.put(
      `${API_BASE}/goals/${goalId}`,
      { isPrimary: true }
    );
    return response.data.data;
  },

  /**
   * Mark a goal as completed
   */
  async completeGoal(goalId: string): Promise<Goal> {
    const response: AxiosResponse<ApiResponse<Goal>> = await axios.put(
      `${API_BASE}/goals/${goalId}`,
      { status: 'completed' }
    );
    return response.data.data;
  },

  /**
   * Pause a goal
   */
  async pauseGoal(goalId: string): Promise<Goal> {
    const response: AxiosResponse<ApiResponse<Goal>> = await axios.put(
      `${API_BASE}/goals/${goalId}`,
      { status: 'paused' }
    );
    return response.data.data;
  },

  /**
   * Resume a paused goal
   */
  async resumeGoal(goalId: string): Promise<Goal> {
    const response: AxiosResponse<ApiResponse<Goal>> = await axios.put(
      `${API_BASE}/goals/${goalId}`,
      { status: 'active' }
    );
    return response.data.data;
  },

  /**
   * Cancel a goal
   */
  async cancelGoal(goalId: string): Promise<Goal> {
    const response: AxiosResponse<ApiResponse<Goal>> = await axios.put(
      `${API_BASE}/goals/${goalId}`,
      { status: 'cancelled' }
    );
    return response.data.data;
  },
};

export type { Goal, CreateGoalInput, UpdateGoalInput, GoalSummary };
