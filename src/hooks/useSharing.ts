/**
 * Custom hook for managing sharing and friendship data.
 * Provides a unified interface to access friends, pending requests,
 * and friendship actions.
 */

import { useState, useEffect, useCallback } from 'react';
import type { Friend, FriendRequest, UserSearchResult } from '@/types';
import { sharingService } from '@/services/sharingService';

/**
 * Return type for the useSharing hook
 */
export interface UseSharingReturn {
  /** List of accepted friends */
  friends: Friend[];
  /** Pending incoming friend requests */
  pendingIncoming: FriendRequest[];
  /** Pending outgoing friend requests */
  pendingOutgoing: FriendRequest[];
  /** Whether data is currently loading */
  loading: boolean;
  /** Error message if any request failed */
  error: string | null;
  /** Refetch all sharing data */
  refetch: () => Promise<void>;
  /** Send a friend request to a user */
  sendRequest: (userId: string) => Promise<boolean>;
  /** Accept a pending friend request */
  acceptRequest: (friendshipId: string) => Promise<boolean>;
  /** Reject a pending friend request */
  rejectRequest: (friendshipId: string) => Promise<boolean>;
  /** Revoke access / remove a friend */
  revokeAccess: (friendshipId: string) => Promise<boolean>;
  /** Search for users by name or email */
  searchUsers: (query: string) => Promise<UserSearchResult[]>;
}

/**
 * Custom hook for managing sharing and friendship data.
 *
 * @param autoFetch - Whether to automatically fetch data on mount (default: true)
 * @returns Object containing sharing data, loading state, error state, and actions
 *
 * @example
 * ```tsx
 * const { friends, pendingIncoming, loading, error, sendRequest } = useSharing();
 *
 * if (loading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage message={error} />;
 *
 * return <div>Friends: {friends.length}</div>;
 * ```
 */
export function useSharing(autoFetch = true): UseSharingReturn {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingIncoming, setPendingIncoming] = useState<FriendRequest[]>([]);
  const [pendingOutgoing, setPendingOutgoing] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all sharing data from the API
   */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await sharingService.getRelationships();

      if (response.data.success) {
        const { accepted, pending } = response.data.data;

        // Set accepted friends
        setFriends(accepted);

        // Separate pending requests by direction
        const incoming = pending.filter((req) => req.direction === 'incoming');
        const outgoing = pending.filter((req) => req.direction === 'outgoing');

        setPendingIncoming(incoming);
        setPendingOutgoing(outgoing);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch sharing data';
      setError(errorMessage);
      console.error('useSharing fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Send a friend request to a user
   * @param userId - ID of the user to send request to
   * @returns Whether the request was successful
   */
  const sendRequest = useCallback(
    async (userId: string): Promise<boolean> => {
      try {
        const response = await sharingService.sendRequest(userId);
        if (response.data.success) {
          // Refetch to update the pending outgoing list
          await fetchAll();
          return true;
        }
        return false;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to send friend request';
        setError(errorMessage);
        console.error('sendRequest error:', err);
        return false;
      }
    },
    [fetchAll]
  );

  /**
   * Accept a pending friend request
   * @param friendshipId - ID of the friendship to accept
   * @returns Whether the request was successful
   */
  const acceptRequest = useCallback(
    async (friendshipId: string): Promise<boolean> => {
      try {
        const response = await sharingService.acceptRequest(friendshipId);
        if (response.data.success) {
          // Refetch to update friends and pending lists
          await fetchAll();
          return true;
        }
        return false;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to accept friend request';
        setError(errorMessage);
        console.error('acceptRequest error:', err);
        return false;
      }
    },
    [fetchAll]
  );

  /**
   * Reject a pending friend request
   * @param friendshipId - ID of the friendship to reject
   * @returns Whether the request was successful
   */
  const rejectRequest = useCallback(
    async (friendshipId: string): Promise<boolean> => {
      try {
        const response = await sharingService.rejectRequest(friendshipId);
        if (response.data.success) {
          // Refetch to update pending list
          await fetchAll();
          return true;
        }
        return false;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to reject friend request';
        setError(errorMessage);
        console.error('rejectRequest error:', err);
        return false;
      }
    },
    [fetchAll]
  );

  /**
   * Revoke access / remove a friend
   * @param friendshipId - ID of the friendship to remove
   * @returns Whether the request was successful
   */
  const revokeAccess = useCallback(
    async (friendshipId: string): Promise<boolean> => {
      try {
        const response = await sharingService.revokeAccess(friendshipId);
        if (response.data.success) {
          // Refetch to update friends list
          await fetchAll();
          return true;
        }
        return false;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to revoke access';
        setError(errorMessage);
        console.error('revokeAccess error:', err);
        return false;
      }
    },
    [fetchAll]
  );

  /**
   * Search for users by name or email
   * @param query - Search query string
   * @returns List of matching users
   */
  const searchUsers = useCallback(
    async (query: string): Promise<UserSearchResult[]> => {
      try {
        const response = await sharingService.searchUsers(query);
        if (response.data.success) {
          return response.data.data.users;
        }
        return [];
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to search users';
        setError(errorMessage);
        console.error('searchUsers error:', err);
        return [];
      }
    },
    []
  );

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchAll();
    }
  }, [autoFetch, fetchAll]);

  return {
    friends,
    pendingIncoming,
    pendingOutgoing,
    loading,
    error,
    refetch: fetchAll,
    sendRequest,
    acceptRequest,
    rejectRequest,
    revokeAccess,
    searchUsers,
  };
}

export default useSharing;
