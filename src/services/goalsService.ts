/**
 * Goals API service for the Pasos app.
 * Handles all group goal-related API calls using axios.
 */

import axios from 'axios';
import type { ApiResponse } from '@/types';
import type {
  GroupGoal,
  GroupGoalProgress,
  CreateGroupGoalPayload,
} from '@/types/goal';

/**
 * Base URL for API requests - uses environment variable or defaults to localhost
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Response data for getUserGoals
 */
export interface UserGoalsData {
  /** List of user's goals (as creator or member) */
  goals: GroupGoal[];
}

/**
 * Response data for createGoal
 */
export interface CreateGoalData {
  /** The created goal */
  goal: GroupGoal;
}

/**
 * Response data for getGoalDetails
 */
export interface GoalDetailsData {
  /** The goal with full details including members */
  goal: GroupGoal;
}

/**
 * Response data for inviteUser
 */
export interface InviteUserData {
  /** Confirmation message */
  message: string;
  /** ID of the invited user */
  invitedUserId: string;
}

/**
 * Response data for joinGoal
 */
export interface JoinGoalData {
  /** Confirmation message */
  message: string;
  /** The updated goal */
  goal: GroupGoal;
}

/**
 * Response data for leaveGoal
 */
export interface LeaveGoalData {
  /** Confirmation message */
  message: string;
}

/**
 * Response data for getGoalProgress
 */
export interface GoalProgressData {
  /** Progress information for the goal */
  progress: GroupGoalProgress;
}

/**
 * Goals API service with methods for all goal-related operations
 */
export const goalsService = {
  /**
   * Get all goals for the current user (as creator or member)
   * @returns Promise with array of goals
   */
  getUserGoals: () =>
    axios.get<ApiResponse<UserGoalsData>>(`${API_BASE}/goals`),

  /**
   * Create a new group goal
   * @param payload - Goal creation data (name, targetSteps, dates, etc.)
   * @returns Promise with the created goal
   */
  createGoal: (payload: CreateGroupGoalPayload) =>
    axios.post<ApiResponse<CreateGoalData>>(`${API_BASE}/goals`, payload),

  /**
   * Get detailed information about a specific goal
   * @param goalId - The goal ID
   * @returns Promise with full goal details including members
   */
  getGoalDetails: (goalId: string) =>
    axios.get<ApiResponse<GoalDetailsData>>(`${API_BASE}/goals/${goalId}`),

  /**
   * Invite a user to join a goal
   * @param goalId - The goal ID
   * @param userId - The user ID to invite
   * @returns Promise with invitation confirmation
   */
  inviteUser: (goalId: string, userId: string) =>
    axios.post<ApiResponse<InviteUserData>>(
      `${API_BASE}/goals/${goalId}/invite`,
      { userId }
    ),

  /**
   * Join a goal (accept an invitation)
   * @param goalId - The goal ID to join
   * @returns Promise with join confirmation and updated goal
   */
  joinGoal: (goalId: string) =>
    axios.put<ApiResponse<JoinGoalData>>(`${API_BASE}/goals/${goalId}/join`),

  /**
   * Leave a goal (for non-owners)
   * @param goalId - The goal ID to leave
   * @returns Promise with leave confirmation
   */
  leaveGoal: (goalId: string) =>
    axios.delete<ApiResponse<LeaveGoalData>>(
      `${API_BASE}/goals/${goalId}/leave`
    ),

  /**
   * Get progress information for a goal
   * @param goalId - The goal ID
   * @returns Promise with progress data (current steps, target, percentage)
   */
  getGoalProgress: (goalId: string) =>
    axios.get<ApiResponse<GoalProgressData>>(
      `${API_BASE}/goals/${goalId}/progress`
    ),
};

export default goalsService;
