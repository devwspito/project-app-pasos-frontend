/**
 * Goal-related TypeScript types for the Pasos app.
 * Defines fitness goals, challenges, and progress tracking.
 */

import type { UserId } from './user.types';
import type { TimePeriod } from './activity.types';

/**
 * Goal identifier type
 */
export type GoalId = string;

/**
 * Challenge identifier type
 */
export type ChallengeId = string;

/**
 * Goal status
 */
export type GoalStatus = 'active' | 'completed' | 'failed' | 'paused' | 'cancelled';

/**
 * Goal type - what metric is being tracked
 */
export type GoalType = 'steps' | 'distance' | 'calories' | 'active_minutes' | 'streak';

/**
 * Challenge type
 */
export type ChallengeType = 'individual' | 'group' | 'versus';

/**
 * Individual fitness goal
 */
export interface Goal {
  /** Unique goal identifier */
  id: GoalId;
  /** User who created the goal */
  userId: UserId;
  /** Goal title/name */
  title: string;
  /** Optional description */
  description?: string;
  /** Type of goal */
  type: GoalType;
  /** Target value to achieve */
  targetValue: number;
  /** Current progress value */
  currentValue: number;
  /** Progress percentage (0-100) */
  progressPercentage: number;
  /** Time period for the goal */
  period: TimePeriod;
  /** Goal start date (ISO 8601 date format) */
  startDate: string;
  /** Goal end date (ISO 8601 date format) */
  endDate: string;
  /** Current status */
  status: GoalStatus;
  /** Whether this is the primary/default goal */
  isPrimary: boolean;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** Completion timestamp (if completed) */
  completedAt?: string;
}

/**
 * Goal creation input
 */
export interface CreateGoalInput {
  title: string;
  description?: string;
  type: GoalType;
  targetValue: number;
  period: TimePeriod;
  startDate: string;
  endDate: string;
  isPrimary?: boolean;
}

/**
 * Goal update input
 */
export interface UpdateGoalInput {
  title?: string;
  description?: string;
  targetValue?: number;
  endDate?: string;
  status?: GoalStatus;
  isPrimary?: boolean;
}

/**
 * Step streak information
 */
export interface Streak {
  /** Current consecutive days meeting goal */
  currentStreak: number;
  /** Longest streak ever achieved */
  longestStreak: number;
  /** Date longest streak was achieved */
  longestStreakDate?: string;
  /** Streak start date */
  streakStartDate?: string;
  /** Whether user met goal yesterday (streak continues) */
  isStreakActive: boolean;
}

/**
 * Challenge (competition between users)
 */
export interface Challenge {
  /** Unique challenge identifier */
  id: ChallengeId;
  /** Challenge creator */
  creatorId: UserId;
  /** Challenge title */
  title: string;
  /** Challenge description */
  description?: string;
  /** Type of challenge */
  type: ChallengeType;
  /** Goal type being challenged */
  goalType: GoalType;
  /** Target value to win */
  targetValue: number;
  /** Challenge start time (ISO 8601 timestamp) */
  startTime: string;
  /** Challenge end time (ISO 8601 timestamp) */
  endTime: string;
  /** Current status */
  status: GoalStatus;
  /** Participant IDs */
  participantIds: UserId[];
  /** Winner ID (if completed) */
  winnerId?: UserId;
  /** Challenge creation timestamp */
  createdAt: string;
}

/**
 * Challenge participant with progress
 */
export interface ChallengeParticipant {
  /** User ID */
  userId: UserId;
  /** Participant name */
  name: string;
  /** Avatar URL */
  avatarUrl?: string;
  /** Current progress value */
  currentValue: number;
  /** Progress percentage */
  progressPercentage: number;
  /** Rank in the challenge */
  rank: number;
  /** Whether this participant has completed the challenge */
  hasCompleted: boolean;
  /** Join timestamp */
  joinedAt: string;
}

/**
 * Challenge with detailed participant info
 */
export interface ChallengeDetails extends Challenge {
  /** Detailed participant list with progress */
  participants: ChallengeParticipant[];
  /** Current user's progress (if participating) */
  currentUserProgress?: ChallengeParticipant;
  /** Whether current user is participating */
  isParticipating: boolean;
}

/**
 * Achievement/badge earned by user
 */
export interface Achievement {
  /** Achievement ID */
  id: string;
  /** Achievement name */
  name: string;
  /** Achievement description */
  description: string;
  /** Icon or badge image URL */
  iconUrl: string;
  /** Category (e.g., 'steps', 'streak', 'social') */
  category: string;
  /** Requirement to earn (e.g., "Walk 100,000 steps") */
  requirement: string;
  /** Date earned (ISO 8601 timestamp), null if not earned */
  earnedAt: string | null;
  /** Whether the achievement is earned */
  isEarned: boolean;
  /** Progress towards achievement (0-100) */
  progress: number;
}

/**
 * Goal summary for dashboard display
 */
export interface GoalSummary {
  /** Active goals count */
  activeGoals: number;
  /** Completed goals count */
  completedGoals: number;
  /** Primary goal (if set) */
  primaryGoal: Goal | null;
  /** Current streak */
  streak: Streak;
  /** Recent achievements */
  recentAchievements: Achievement[];
}
