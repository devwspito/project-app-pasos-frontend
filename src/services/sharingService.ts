/**
 * Service for managing friend relationships and sharing functionality.
 * Handles API calls for friend requests, relationships, and user search.
 */

import axios, { AxiosResponse } from 'axios';
import type { Friend, FriendRequest, UserSearchResult, FriendshipId, Leaderboard, LeaderboardPeriod } from '../types/social.types';
import type { DailyStepSummary, WeeklyStats } from '../types/activity.types';

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
 * Friend stats response from the API
 */
export interface FriendStatsResponse {
  friend: Friend;
  dailyStats: DailyStepSummary[];
  weeklyStats?: WeeklyStats;
  currentStreak: number;
  longestStreak: number;
  totalSteps: number;
}

/**
 * Relationships response containing all friend data
 */
export interface RelationshipsResponse {
  friends: Friend[];
  pendingIncoming: FriendRequest[];
  pendingOutgoing: FriendRequest[];
}

/**
 * Sharing service for managing friendships and social features
 */
export const sharingService = {
  /**
   * Get all relationships for the current user
   */
  async getRelationships(): Promise<RelationshipsResponse> {
    const response: AxiosResponse<ApiResponse<RelationshipsResponse>> = await axios.get(
      `${API_BASE}/sharing/relationships`
    );
    return response.data.data;
  },

  /**
   * Send a friend request to another user
   */
  async sendRequest(userId: string): Promise<FriendRequest> {
    const response: AxiosResponse<ApiResponse<FriendRequest>> = await axios.post(
      `${API_BASE}/sharing/request`,
      { userId }
    );
    return response.data.data;
  },

  /**
   * Accept a friend request
   */
  async acceptRequest(friendshipId: FriendshipId): Promise<Friend> {
    const response: AxiosResponse<ApiResponse<Friend>> = await axios.post(
      `${API_BASE}/sharing/accept`,
      { friendshipId }
    );
    return response.data.data;
  },

  /**
   * Reject a friend request
   */
  async rejectRequest(friendshipId: FriendshipId): Promise<void> {
    await axios.post(`${API_BASE}/sharing/reject`, { friendshipId });
  },

  /**
   * Revoke access / remove a friend
   */
  async revokeAccess(friendshipId: FriendshipId): Promise<void> {
    await axios.post(`${API_BASE}/sharing/revoke`, { friendshipId });
  },

  /**
   * Get detailed stats for a specific friend
   */
  async getFriendStats(friendId: string): Promise<FriendStatsResponse> {
    const response: AxiosResponse<ApiResponse<FriendStatsResponse>> = await axios.get(
      `${API_BASE}/sharing/${friendId}/stats`
    );
    return response.data.data;
  },

  /**
   * Search for users by name or email
   */
  async searchUsers(query: string): Promise<UserSearchResult[]> {
    const response: AxiosResponse<ApiResponse<UserSearchResult[]>> = await axios.get(
      `${API_BASE}/users/search`,
      { params: { q: query } }
    );
    return response.data.data;
  },

  /**
   * Get leaderboard data
   */
  async getLeaderboard(period: LeaderboardPeriod = 'week'): Promise<Leaderboard> {
    const response: AxiosResponse<ApiResponse<Leaderboard>> = await axios.get(
      `${API_BASE}/sharing/leaderboard`,
      { params: { period } }
    );
    return response.data.data;
  },
};

export type { Friend, FriendRequest, UserSearchResult };
