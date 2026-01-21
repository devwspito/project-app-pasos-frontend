/**
 * Hook for managing goals state and actions.
 * Provides goals list, CRUD operations, and summary data.
 */

import { useState, useEffect, useCallback } from 'react';
import { goalsService } from '../services/goalsService';
import type { Goal, CreateGoalInput, UpdateGoalInput, GoalSummary } from '../types/goal.types';

/**
 * Return type for the useGoals hook
 */
export interface UseGoalsReturn {
  /** List of goals */
  goals: Goal[];
  /** Goal summary data */
  summary: GoalSummary | null;
  /** Loading state for goals list */
  loading: boolean;
  /** Loading state for summary */
  summaryLoading: boolean;
  /** Error state */
  error: string | null;
  /** Refetch all goals */
  refetch: () => Promise<void>;
  /** Create a new goal */
  createGoal: (input: CreateGoalInput) => Promise<Goal | null>;
  /** Update an existing goal */
  updateGoal: (goalId: string, input: UpdateGoalInput) => Promise<Goal | null>;
  /** Get a single goal by ID */
  getGoal: (goalId: string) => Promise<Goal | null>;
  /** Refresh summary data */
  refreshSummary: () => Promise<void>;
}

/**
 * Hook to manage goals and goal-related functionality
 * @param autoFetch - Whether to automatically fetch goals on mount (default: true)
 */
export function useGoals(autoFetch: boolean = true): UseGoalsReturn {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [summary, setSummary] = useState<GoalSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all goals from the API
   */
  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await goalsService.getGoals();
      if (response.data.success && response.data.data) {
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
   * Fetch goal summary
   */
  const refreshSummary = useCallback(async (): Promise<void> => {
    setSummaryLoading(true);
    try {
      const response = await goalsService.getSummary();
      if (response.data.success && response.data.data) {
        setSummary(response.data.data.summary);
      }
    } catch (err) {
      console.error('Error fetching goal summary:', err);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  /**
   * Create a new goal
   */
  const createGoal = useCallback(async (input: CreateGoalInput): Promise<Goal | null> => {
    try {
      const response = await goalsService.createGoal(input);
      if (response.data.success && response.data.data) {
        const newGoal = response.data.data.goal;
        setGoals((prev) => [...prev, newGoal]);
        // Refresh summary after creating a goal
        refreshSummary();
        return newGoal;
      }
      return null;
    } catch (err) {
      console.error('Error creating goal:', err);
      const message = err instanceof Error ? err.message : 'Failed to create goal';
      setError(message);
      return null;
    }
  }, [refreshSummary]);

  /**
   * Update an existing goal
   */
  const updateGoal = useCallback(async (goalId: string, input: UpdateGoalInput): Promise<Goal | null> => {
    try {
      const response = await goalsService.updateGoal(goalId, input);
      if (response.data.success && response.data.data) {
        const updatedGoal = response.data.data.goal;
        setGoals((prev) =>
          prev.map((goal) => (goal.id === goalId ? updatedGoal : goal))
        );
        // Refresh summary after updating a goal
        refreshSummary();
        return updatedGoal;
      }
      return null;
    } catch (err) {
      console.error('Error updating goal:', err);
      return null;
    }
  }, [refreshSummary]);

  /**
   * Get a single goal by ID
   */
  const getGoal = useCallback(async (goalId: string): Promise<Goal | null> => {
    try {
      const response = await goalsService.getGoal(goalId);
      if (response.data.success && response.data.data) {
        return response.data.data.goal;
      }
      return null;
    } catch (err) {
      console.error('Error fetching goal:', err);
      return null;
    }
  }, []);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      refetch();
      refreshSummary();
    }
  }, [autoFetch, refetch, refreshSummary]);

  return {
    goals,
    summary,
    loading,
    summaryLoading,
    error,
    refetch,
    createGoal,
    updateGoal,
    getGoal,
    refreshSummary,
  };
}

export type { Goal, CreateGoalInput, UpdateGoalInput, GoalSummary };
