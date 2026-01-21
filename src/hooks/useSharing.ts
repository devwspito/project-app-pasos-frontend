/**
 * Hook for managing sharing/friendship state and actions.
 * Provides friends list, pending requests, and mutation methods.
 */

import { useState, useEffect, useCallback } from 'react';
import { sharingService, FriendStatsResponse } from '../services/sharingService';
import type { Friend, FriendRequest, UserSearchResult } from '../types/social.types';

/**
 * Return type for the useSharing hook
 */
export interface UseSharingReturn {
  /** List of accepted friends */
  friends: Friend[];
  /** Incoming pending friend requests */
  pendingIncoming: FriendRequest[];
  /** Outgoing pending friend requests */
  pendingOutgoing: FriendRequest[];
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: string | null;
  /** Refetch all relationships */
  refetch: () => Promise<void>;
  /** Send a friend request */
  sendRequest: (userId: string) => Promise<boolean>;
  /** Accept a friend request */
  acceptRequest: (friendshipId: string) => Promise<boolean>;
  /** Reject a friend request */
  rejectRequest: (friendshipId: string) => Promise<boolean>;
  /** Remove a friend / revoke access */
  revokeAccess: (friendshipId: string) => Promise<boolean>;
  /** Search for users */
  searchUsers: (query: string) => Promise<UserSearchResult[]>;
  /** Get friend stats */
  getFriendStats: (friendId: string) => Promise<FriendStatsResponse | null>;
}

/**
 * Hook to manage friend relationships and sharing functionality
 * @param autoFetch - Whether to automatically fetch relationships on mount (default: true)
 */
export function useSharing(autoFetch: boolean = true): UseSharingReturn {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingIncoming, setPendingIncoming] = useState<FriendRequest[]>([]);
  const [pendingOutgoing, setPendingOutgoing] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all relationships from the API
   */
  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const relationships = await sharingService.getRelationships();
      setFriends(relationships.friends);
      setPendingIncoming(relationships.pendingIncoming);
      setPendingOutgoing(relationships.pendingOutgoing);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch relationships';
      setError(message);
      console.error('Error fetching relationships:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Send a friend request to a user
   */
  const sendRequest = useCallback(async (userId: string): Promise<boolean> => {
    try {
      await sharingService.sendRequest(userId);
      await refetch();
      return true;
    } catch (err) {
      console.error('Error sending friend request:', err);
      return false;
    }
  }, [refetch]);

  /**
   * Accept a friend request
   */
  const acceptRequest = useCallback(async (friendshipId: string): Promise<boolean> => {
    try {
      await sharingService.acceptRequest(friendshipId);
      await refetch();
      return true;
    } catch (err) {
      console.error('Error accepting friend request:', err);
      return false;
    }
  }, [refetch]);

  /**
   * Reject a friend request
   */
  const rejectRequest = useCallback(async (friendshipId: string): Promise<boolean> => {
    try {
      await sharingService.rejectRequest(friendshipId);
      await refetch();
      return true;
    } catch (err) {
      console.error('Error rejecting friend request:', err);
      return false;
    }
  }, [refetch]);

  /**
   * Remove a friend / revoke access
   */
  const revokeAccess = useCallback(async (friendshipId: string): Promise<boolean> => {
    try {
      await sharingService.revokeAccess(friendshipId);
      await refetch();
      return true;
    } catch (err) {
      console.error('Error revoking access:', err);
      return false;
    }
  }, [refetch]);

  /**
   * Search for users by query
   */
  const searchUsers = useCallback(async (query: string): Promise<UserSearchResult[]> => {
    try {
      return await sharingService.searchUsers(query);
    } catch (err) {
      console.error('Error searching users:', err);
      return [];
    }
  }, []);

  /**
   * Get detailed stats for a friend
   */
  const getFriendStats = useCallback(async (friendId: string): Promise<FriendStatsResponse | null> => {
    try {
      return await sharingService.getFriendStats(friendId);
    } catch (err) {
      console.error('Error fetching friend stats:', err);
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
    friends,
    pendingIncoming,
    pendingOutgoing,
    loading,
    error,
    refetch,
    sendRequest,
    acceptRequest,
    rejectRequest,
    revokeAccess,
    searchUsers,
    getFriendStats,
  };
}

export type { Friend, FriendRequest, UserSearchResult, FriendStatsResponse };
