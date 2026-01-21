/**
 * Social and friends-related TypeScript types for the Pasos app.
 * Defines friendships, social interactions, and leaderboards.
 */

import type { UserId, PublicUser } from './user.types';
import type { DailyStepSummary } from './activity.types';

/**
 * Friendship identifier
 */
export type FriendshipId = string;

/**
 * Friendship request status
 */
export type FriendshipStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';

/**
 * Leaderboard time period
 */
export type LeaderboardPeriod = 'today' | 'week' | 'month' | 'all_time';

/**
 * Friend request direction
 */
export type FriendRequestDirection = 'incoming' | 'outgoing';

/**
 * Friendship relationship
 */
export interface Friendship {
  /** Unique friendship identifier */
  id: FriendshipId;
  /** User who initiated the friendship */
  requesterId: UserId;
  /** User who received the request */
  addresseeId: UserId;
  /** Current status */
  status: FriendshipStatus;
  /** Request creation timestamp */
  createdAt: string;
  /** Status update timestamp */
  updatedAt: string;
  /** When friendship was accepted (if applicable) */
  acceptedAt?: string;
}

/**
 * Friend with profile and activity data
 */
export interface Friend extends PublicUser {
  /** Friendship status */
  friendshipStatus: FriendshipStatus;
  /** Friend's steps today */
  stepsToday: number;
  /** Whether the friend is currently active/online */
  isActive: boolean;
  /** Last activity timestamp */
  lastActiveAt?: string;
  /** Friend's daily goal */
  dailyGoal?: number;
  /** Friend's current streak */
  currentStreak?: number;
}

/**
 * Friend request with sender/receiver info
 */
export interface FriendRequest {
  /** Friendship ID */
  id: FriendshipId;
  /** Request direction relative to current user */
  direction: FriendRequestDirection;
  /** The other user in the request */
  user: PublicUser;
  /** Request timestamp */
  createdAt: string;
  /** Status */
  status: FriendshipStatus;
}

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
  /** Rank position (1-indexed) */
  rank: number;
  /** User ID */
  userId: UserId;
  /** User's display name */
  name: string;
  /** User's avatar URL */
  avatarUrl?: string;
  /** Step count for the period */
  stepCount: number;
  /** Whether this is the current user */
  isCurrentUser: boolean;
  /** Change in rank from previous period (-1 = moved up 1 spot) */
  rankChange?: number;
}

/**
 * Leaderboard data
 */
export interface Leaderboard {
  /** Time period for this leaderboard */
  period: LeaderboardPeriod;
  /** Leaderboard entries (sorted by rank) */
  entries: LeaderboardEntry[];
  /** Total participants */
  totalParticipants: number;
  /** Current user's entry (for quick access) */
  currentUserEntry?: LeaderboardEntry;
  /** Last updated timestamp */
  lastUpdatedAt: string;
}

/**
 * Activity feed item types
 */
export type FeedItemType =
  | 'goal_achieved'
  | 'streak_milestone'
  | 'challenge_won'
  | 'challenge_joined'
  | 'achievement_earned'
  | 'friend_joined'
  | 'daily_record';

/**
 * Activity feed item
 */
export interface FeedItem {
  /** Unique feed item ID */
  id: string;
  /** Type of activity */
  type: FeedItemType;
  /** User who performed the action */
  user: PublicUser;
  /** Activity title */
  title: string;
  /** Activity description */
  description: string;
  /** Related value (e.g., step count, streak days) */
  value?: number;
  /** Activity timestamp */
  timestamp: string;
  /** Whether current user has liked this */
  isLiked: boolean;
  /** Number of likes */
  likeCount: number;
  /** Number of comments */
  commentCount: number;
}

/**
 * Comment on a feed item
 */
export interface FeedComment {
  /** Comment ID */
  id: string;
  /** Feed item ID */
  feedItemId: string;
  /** User who commented */
  user: PublicUser;
  /** Comment text */
  text: string;
  /** Comment timestamp */
  createdAt: string;
}

/**
 * Friends list summary
 */
export interface FriendsSummary {
  /** Total friend count */
  totalFriends: number;
  /** Friends active today */
  activeToday: number;
  /** Pending incoming requests */
  pendingIncoming: number;
  /** Pending outgoing requests */
  pendingOutgoing: number;
  /** Top performing friends today */
  topFriendsToday: Friend[];
}

/**
 * Friend comparison data
 */
export interface FriendComparison {
  /** Friend being compared */
  friend: Friend;
  /** Current user's daily summary */
  userSummary: DailyStepSummary;
  /** Friend's daily summary */
  friendSummary: DailyStepSummary;
  /** Step difference (positive = user is ahead) */
  stepDifference: number;
  /** Who is leading */
  leader: 'user' | 'friend' | 'tie';
}

/**
 * User search result
 */
export interface UserSearchResult extends PublicUser {
  /** Whether already friends */
  isFriend: boolean;
  /** Whether request is pending */
  isPending: boolean;
  /** Friendship ID (if exists) */
  friendshipId?: FriendshipId;
}
