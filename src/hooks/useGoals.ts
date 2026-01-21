/**
 * Hook for managing goals state and actions.
 * Provides goals list, loading state, and mutation methods.
 */

import { useState, useEffect, useCallback } from 'react';
import { goalsService } from '../services/goalsService';
import type { GroupGoal, CreateGroupGoalPayload, GroupGoalProgress } from '../types/goal';

/**
 * Return type for the useGoals hook
 */
export interface UseGoalsReturn {
  /** List of user's goals */
  goals: GroupGoal[];
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: string | null;
  /** Refetch all goals */
  refetch: () => Promise<void>;
  /** Create a new goal */
  createGoal: (payload: CreateGroupGoalPayload) => Promise<GroupGoal | null>;
  /** Get goal details */
  getGoalDetails: (goalId: string) => Promise<GroupGoal | null>;
  /** Get goal progress */
  getGoalProgress: (goalId: string) => Promise<GroupGoalProgress | null>;
  /** Join a goal */
  joinGoal: (goalId: string) => Promise<boolean>;
  /** Leave a goal */
  leaveGoal: (goalId: string) => Promise<boolean>;
  /** Invite a user to a goal */
  inviteUser: (goalId: string, userId: string) => Promise<boolean>;
}

/**
 * Hook to manage goals functionality
 * @param autoFetch - Whether to automatically fetch goals on mount (default: true)
 */
export function useGoals(autoFetch: boolean = true): UseGoalsReturn {
  const [goals, setGoals] = useState<GroupGoal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all goals from the API
   */
  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await goalsService.getUserGoals();
      if (response.data.success) {
        setGoals(response.data.data.goals);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch goals';
      setError(message);
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new goal
   */
  const createGoal = useCallback(async (payload: CreateGroupGoalPayload): Promise<GroupGoal | null> => {
    try {
      const response = await goalsService.createGoal(payload);
      if (response.data.success) {
        await refetch();
        return response.data.data.goal;
      }
      return null;
    } catch (err) {
      console.error('Error creating goal:', err);
      return null;
    }
  }, [refetch]);

  /**
   * Get details for a specific goal
   */
  const getGoalDetails = useCallback(async (goalId: string): Promise<GroupGoal | null> => {
    try {
      const response = await goalsService.getGoalDetails(goalId);
      if (response.data.success) {
        return response.data.data.goal;
      }
      return null;
    } catch (err) {
      console.error('Error fetching goal details:', err);
      return null;
    }
  }, []);

  /**
   * Get progress for a specific goal
   */
  const getGoalProgress = useCallback(async (goalId: string): Promise<GroupGoalProgress | null> => {
    try {
      const response = await goalsService.getGoalProgress(goalId);
      if (response.data.success) {
        return response.data.data.progress;
      }
      return null;
    } catch (err) {
      console.error('Error fetching goal progress:', err);
      return null;
    }
  }, []);

  /**
   * Join a goal
   */
  const joinGoal = useCallback(async (goalId: string): Promise<boolean> => {
    try {
      const response = await goalsService.joinGoal(goalId);
      if (response.data.success) {
        await refetch();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error joining goal:', err);
      return false;
    }
  }, [refetch]);

  /**
   * Leave a goal
   */
  const leaveGoal = useCallback(async (goalId: string): Promise<boolean> => {
    try {
      const response = await goalsService.leaveGoal(goalId);
      if (response.data.success) {
        await refetch();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error leaving goal:', err);
      return false;
    }
  }, [refetch]);

  /**
   * Invite a user to a goal
   */
  const inviteUser = useCallback(async (goalId: string, userId: string): Promise<boolean> => {
    try {
      const response = await goalsService.inviteUser(goalId, userId);
      if (response.data.success) {
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error inviting user:', err);
      return false;
    }
  }, []);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      refetch();
    }
  }, [autoFetch, refetch]);

  return {
    goals,
    loading,
    error,
    refetch,
    createGoal,
    getGoalDetails,
    getGoalProgress,
    joinGoal,
    leaveGoal,
    inviteUser,
  };
}

export default useGoals;
