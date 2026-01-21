/**
 * Hook for managing goals state and actions.
 * Provides goals list, CRUD operations, and loading/error states.
 */

import { useState, useEffect, useCallback } from 'react';
import { goalsService } from '../services/goalsService';
import type { Goal, CreateGoalInput, UpdateGoalInput, GoalSummary } from '../types/goal.types.ts';

/**
 * Return type for the useGoals hook
 */
export interface UseGoalsReturn {
  /** List of all goals */
  goals: Goal[];
  /** Currently selected/viewed goal */
  selectedGoal: Goal | null;
  /** Goal summary data */
  summary: GoalSummary | null;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: string | null;
  /** Refetch all goals */
  refetch: () => Promise<void>;
  /** Get a goal by ID */
  getGoal: (goalId: string) => Promise<Goal | null>;
  /** Create a new goal */
  createGoal: (input: CreateGoalInput) => Promise<Goal | null>;
  /** Update an existing goal */
  updateGoal: (goalId: string, input: UpdateGoalInput) => Promise<Goal | null>;
  /** Set a goal as primary */
  setPrimary: (goalId: string) => Promise<boolean>;
  /** Complete a goal */
  completeGoal: (goalId: string) => Promise<boolean>;
  /** Pause a goal */
  pauseGoal: (goalId: string) => Promise<boolean>;
  /** Resume a paused goal */
  resumeGoal: (goalId: string) => Promise<boolean>;
  /** Cancel a goal */
  cancelGoal: (goalId: string) => Promise<boolean>;
  /** Clear selected goal */
  clearSelectedGoal: () => void;
  /** Fetch goal summary */
  fetchSummary: () => Promise<GoalSummary | null>;
}

/**
 * Hook to manage goals state and operations
 * @param autoFetch - Whether to automatically fetch goals on mount (default: true)
 */
export function useGoals(autoFetch: boolean = true): UseGoalsReturn {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [summary, setSummary] = useState<GoalSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all goals from API
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
   * Get a specific goal by ID
   */
  const getGoal = useCallback(async (goalId: string): Promise<Goal | null> => {
    setLoading(true);
    setError(null);
    try {
      const goal = await goalsService.getGoalById(goalId);
      setSelectedGoal(goal);
      return goal;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch goal';
      setError(message);
      console.error('Error fetching goal:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new goal
   */
  const createGoal = useCallback(async (input: CreateGoalInput): Promise<Goal | null> => {
    setLoading(true);
    setError(null);
    try {
      const newGoal = await goalsService.createGoal(input);
      setGoals(prev => [...prev, newGoal]);
      return newGoal;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create goal';
      setError(message);
      console.error('Error creating goal:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing goal
   */
  const updateGoal = useCallback(async (goalId: string, input: UpdateGoalInput): Promise<Goal | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedGoal = await goalsService.updateGoal(goalId, input);
      setGoals(prev => prev.map(g => g.id === goalId ? updatedGoal : g));
      if (selectedGoal?.id === goalId) {
        setSelectedGoal(updatedGoal);
      }
      return updatedGoal;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update goal';
      setError(message);
      console.error('Error updating goal:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedGoal?.id]);

  /**
   * Set a goal as primary
   */
  const setPrimary = useCallback(async (goalId: string): Promise<boolean> => {
    try {
      const updatedGoal = await goalsService.setPrimaryGoal(goalId);
      // Update local state - set all goals to not primary, then set the target one
      setGoals(prev => prev.map(g => ({
        ...g,
        isPrimary: g.id === goalId ? true : false
      })));
      if (selectedGoal?.id === goalId) {
        setSelectedGoal(updatedGoal);
      }
      return true;
    } catch (err) {
      console.error('Error setting primary goal:', err);
      return false;
    }
  }, [selectedGoal?.id]);

  /**
   * Complete a goal
   */
  const completeGoal = useCallback(async (goalId: string): Promise<boolean> => {
    try {
      const updatedGoal = await goalsService.completeGoal(goalId);
      setGoals(prev => prev.map(g => g.id === goalId ? updatedGoal : g));
      if (selectedGoal?.id === goalId) {
        setSelectedGoal(updatedGoal);
      }
      return true;
    } catch (err) {
      console.error('Error completing goal:', err);
      return false;
    }
  }, [selectedGoal?.id]);

  /**
   * Pause a goal
   */
  const pauseGoal = useCallback(async (goalId: string): Promise<boolean> => {
    try {
      const updatedGoal = await goalsService.pauseGoal(goalId);
      setGoals(prev => prev.map(g => g.id === goalId ? updatedGoal : g));
      if (selectedGoal?.id === goalId) {
        setSelectedGoal(updatedGoal);
      }
      return true;
    } catch (err) {
      console.error('Error pausing goal:', err);
      return false;
    }
  }, [selectedGoal?.id]);

  /**
   * Resume a paused goal
   */
  const resumeGoal = useCallback(async (goalId: string): Promise<boolean> => {
    try {
      const updatedGoal = await goalsService.resumeGoal(goalId);
      setGoals(prev => prev.map(g => g.id === goalId ? updatedGoal : g));
      if (selectedGoal?.id === goalId) {
        setSelectedGoal(updatedGoal);
      }
      return true;
    } catch (err) {
      console.error('Error resuming goal:', err);
      return false;
    }
  }, [selectedGoal?.id]);

  /**
   * Cancel a goal
   */
  const cancelGoal = useCallback(async (goalId: string): Promise<boolean> => {
    try {
      const updatedGoal = await goalsService.cancelGoal(goalId);
      setGoals(prev => prev.map(g => g.id === goalId ? updatedGoal : g));
      if (selectedGoal?.id === goalId) {
        setSelectedGoal(updatedGoal);
      }
      return true;
    } catch (err) {
      console.error('Error cancelling goal:', err);
      return false;
    }
  }, [selectedGoal?.id]);

  /**
   * Clear selected goal
   */
  const clearSelectedGoal = useCallback((): void => {
    setSelectedGoal(null);
  }, []);

  /**
   * Fetch goal summary
   */
  const fetchSummary = useCallback(async (): Promise<GoalSummary | null> => {
    try {
      const summaryData = await goalsService.getGoalSummary();
      setSummary(summaryData);
      return summaryData;
    } catch (err) {
      console.error('Error fetching goal summary:', err);
      return null;
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
    selectedGoal,
    summary,
    loading,
    error,
    refetch,
    getGoal,
    createGoal,
    updateGoal,
    setPrimary,
    completeGoal,
    pauseGoal,
    resumeGoal,
    cancelGoal,
    clearSelectedGoal,
    fetchSummary,
  };
}

export type { Goal, CreateGoalInput, UpdateGoalInput, GoalSummary };
