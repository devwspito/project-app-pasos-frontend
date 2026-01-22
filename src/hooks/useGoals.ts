/**
 * Hook for managing goals state and actions.
 * Provides goals list, summary, and mutation methods.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  goalsService,
  GoalDetailResponse,
} from '../services/goalsService';
import type {
  Goal,
  GoalId,
  CreateGoalInput,
  UpdateGoalInput,
  GoalSummary,
  Streak,
} from '../types/goal.types';

/**
 * Return type for the useGoals hook
 */
export interface UseGoalsReturn {
  /** List of all goals */
  goals: Goal[];
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: string | null;
  /** Refetch all goals */
  refetch: () => Promise<void>;
  /** Create a new goal */
  createGoal: (input: CreateGoalInput) => Promise<Goal | null>;
  /** Update an existing goal */
  updateGoal: (goalId: GoalId, input: UpdateGoalInput) => Promise<Goal | null>;
  /** Get goal details by ID */
  getGoalById: (goalId: GoalId) => Promise<GoalDetailResponse | null>;
  /** Get goals summary */
  getGoalsSummary: () => Promise<GoalSummary | null>;
  /** Get streak info */
  getStreak: () => Promise<Streak | null>;
  /** Complete a goal */
  completeGoal: (goalId: GoalId) => Promise<boolean>;
  /** Pause a goal */
  pauseGoal: (goalId: GoalId) => Promise<boolean>;
  /** Resume a goal */
  resumeGoal: (goalId: GoalId) => Promise<boolean>;
}

/**
 * Hook to manage fitness goals
 * @param autoFetch - Whether to automatically fetch goals on mount (default: true)
 */
export function useGoals(autoFetch: boolean = true): UseGoalsReturn {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all goals from the API
   */
  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const fetchedGoals = await goalsService.getGoals();
      setGoals(fetchedGoals);
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
  const createGoal = useCallback(async (input: CreateGoalInput): Promise<Goal | null> => {
    try {
      const newGoal = await goalsService.createGoal(input);
      await refetch();
      return newGoal;
    } catch (err) {
      console.error('Error creating goal:', err);
      return null;
    }
  }, [refetch]);

  /**
   * Update an existing goal
   */
  const updateGoal = useCallback(async (goalId: GoalId, input: UpdateGoalInput): Promise<Goal | null> => {
    try {
      const updatedGoal = await goalsService.updateGoal(goalId, input);
      await refetch();
      return updatedGoal;
    } catch (err) {
      console.error('Error updating goal:', err);
      return null;
    }
  }, [refetch]);

  /**
   * Get goal details by ID
   */
  const getGoalById = useCallback(async (goalId: GoalId): Promise<GoalDetailResponse | null> => {
    try {
      return await goalsService.getGoalById(goalId);
    } catch (err) {
      console.error('Error fetching goal details:', err);
      return null;
    }
  }, []);

  /**
   * Get goals summary
   */
  const getGoalsSummary = useCallback(async (): Promise<GoalSummary | null> => {
    try {
      return await goalsService.getGoalsSummary();
    } catch (err) {
      console.error('Error fetching goals summary:', err);
      return null;
    }
  }, []);

  /**
   * Get streak info
   */
  const getStreak = useCallback(async (): Promise<Streak | null> => {
    try {
      return await goalsService.getStreak();
    } catch (err) {
      console.error('Error fetching streak:', err);
      return null;
    }
  }, []);

  /**
   * Complete a goal
   */
  const completeGoal = useCallback(async (goalId: GoalId): Promise<boolean> => {
    try {
      await goalsService.completeGoal(goalId);
      await refetch();
      return true;
    } catch (err) {
      console.error('Error completing goal:', err);
      return false;
    }
  }, [refetch]);

  /**
   * Pause a goal
   */
  const pauseGoal = useCallback(async (goalId: GoalId): Promise<boolean> => {
    try {
      await goalsService.pauseGoal(goalId);
      await refetch();
      return true;
    } catch (err) {
      console.error('Error pausing goal:', err);
      return false;
    }
  }, [refetch]);

  /**
   * Resume a goal
   */
  const resumeGoal = useCallback(async (goalId: GoalId): Promise<boolean> => {
    try {
      await goalsService.resumeGoal(goalId);
      await refetch();
      return true;
    } catch (err) {
      console.error('Error resuming goal:', err);
      return false;
    }
  }, [refetch]);

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
    updateGoal,
    getGoalById,
    getGoalsSummary,
    getStreak,
    completeGoal,
    pauseGoal,
    resumeGoal,
  };
}

export type { Goal, GoalId, CreateGoalInput, UpdateGoalInput, GoalSummary, Streak, GoalDetailResponse };
