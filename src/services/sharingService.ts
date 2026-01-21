/**
 * Sharing API service for the Pasos app.
 * Handles all friendship and sharing-related API calls using axios.
 */

import axios from 'axios';
import type {
  ApiResponse,
  Friend,
  FriendRequest,
  Friendship,
  UserSearchResult,
} from '@/types';

/**
 * Base URL for API requests - uses environment variable or defaults to localhost
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Relationships response data containing accepted friends and pending requests
 */
export interface RelationshipsData {
  /** List of accepted friends */
  accepted: Friend[];
  /** List of pending friend requests */
  pending: FriendRequest[];
}

/**
 * Send request response data
 */
export interface SendRequestData {
  /** The created friendship ID */
  friendshipId: string;
}

/**
 * Accept request response data
 */
export interface AcceptRequestData {
  /** The updated friendship */
  friendship: Friendship;
}

/**
 * Generic success response data
 */
export interface SuccessData {
  /** Whether the operation was successful */
  success: boolean;
}

/**
 * Friend stats response data - step statistics for a friend
 */
export interface FriendStatsData {
  /** Friend's user ID */
  userId: string;
  /** Friend's display name */
  name: string;
  /** Steps today */
  stepsToday: number;
  /** Steps this week */
  stepsWeek: number;
  /** Steps this month */
  stepsMonth: number;
  /** Current streak in days */
  currentStreak: number;
  /** Daily step goal */
  dailyGoal: number;
}

/**
 * User search response data
 */
export interface UserSearchData {
  /** List of users matching the search query */
  users: UserSearchResult[];
}

/**
 * Sharing API service with methods for all friendship-related operations
 */
export const sharingService = {
  /**
   * Get all relationships (accepted friends and pending requests)
   * @returns Promise with relationships data
   */
  getRelationships: () =>
    axios.get<ApiResponse<RelationshipsData>>(`${API_BASE}/sharing/relationships`),

  /**
   * Send a friend request to a user
   * @param userId - ID of the user to send request to
   * @returns Promise with the created friendship ID
   */
  sendRequest: (userId: string) =>
    axios.post<ApiResponse<SendRequestData>>(`${API_BASE}/sharing/request`, {
      userId,
    }),

  /**
   * Accept a pending friend request
   * @param friendshipId - ID of the friendship to accept
   * @returns Promise with the updated friendship
   */
  acceptRequest: (friendshipId: string) =>
    axios.post<ApiResponse<AcceptRequestData>>(`${API_BASE}/sharing/accept`, {
      friendshipId,
    }),

  /**
   * Reject a pending friend request
   * @param friendshipId - ID of the friendship to reject
   * @returns Promise with success status
   */
  rejectRequest: (friendshipId: string) =>
    axios.post<ApiResponse<SuccessData>>(`${API_BASE}/sharing/reject`, {
      friendshipId,
    }),

  /**
   * Revoke access / remove a friend
   * @param friendshipId - ID of the friendship to remove
   * @returns Promise with success status
   */
  revokeAccess: (friendshipId: string) =>
    axios.delete<ApiResponse<SuccessData>>(`${API_BASE}/sharing/${friendshipId}`),

  /**
   * Get step statistics for a specific friend
   * @param friendId - ID of the friend to get stats for
   * @returns Promise with friend's step statistics
   */
  getFriendStats: (friendId: string) =>
    axios.get<ApiResponse<FriendStatsData>>(
      `${API_BASE}/sharing/${friendId}/stats`
    ),

  /**
   * Search for users by name or email
   * @param query - Search query string
   * @returns Promise with matching users
   */
  searchUsers: (query: string) =>
    axios.get<ApiResponse<UserSearchData>>(`${API_BASE}/users/search`, {
      params: { q: query },
    }),
};

export default sharingService;
