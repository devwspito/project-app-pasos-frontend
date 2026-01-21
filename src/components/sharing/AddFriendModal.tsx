import { useState, useRef, useCallback } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonIcon,
} from '@ionic/react';
import { person } from 'ionicons/icons';
import type { UserSearchResult } from '@/types/social.types';
import { LoadingSpinner } from '@/components/common';

/**
 * Props for AddFriendModal component
 */
export interface AddFriendModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Callback to search users by query */
  onSearch: (query: string) => Promise<UserSearchResult[]>;
  /** Callback to send friend request to a user */
  onSendRequest: (userId: string) => Promise<boolean>;
}

/** Debounce delay in milliseconds */
const DEBOUNCE_DELAY = 300;

/**
 * AddFriendModal - Modal for searching and adding new friends
 *
 * Features:
 * - Debounced search input (300ms)
 * - Search results with user avatar, name, and Add button
 * - Add button disabled for users who are already friends or have pending requests
 * - Button changes to "Sent!" after successful request
 *
 * @example
 * ```tsx
 * <AddFriendModal
 *   isOpen={showAddModal}
 *   onClose={() => setShowAddModal(false)}
 *   onSearch={async (query) => await searchUsers(query)}
 *   onSendRequest={async (userId) => await sendFriendRequest(userId)}
 * />
 * ```
 */
export function AddFriendModal({
  isOpen,
  onClose,
  onSearch,
  onSendRequest,
}: AddFriendModalProps) {
  // Internal state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

  // Ref for debounce timer
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Perform search with the given query
   */
  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setSearching(false);
        return;
      }

      setSearching(true);
      try {
        const results = await onSearch(query.trim());
        setSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    },
    [onSearch]
  );

  /**
   * Handle search input change with debounce
   */
  const handleSearchChange = useCallback(
    (event: CustomEvent) => {
      const query = (event.detail.value as string) || '';
      setSearchQuery(query);

      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new debounced search
      debounceTimerRef.current = setTimeout(() => {
        performSearch(query);
      }, DEBOUNCE_DELAY);
    },
    [performSearch]
  );

  /**
   * Handle send friend request
   */
  const handleSendRequest = async (userId: string) => {
    if (sendingTo || sentRequests.has(userId)) {
      return;
    }

    setSendingTo(userId);
    try {
      const success = await onSendRequest(userId);
      if (success) {
        setSentRequests((prev) => new Set(prev).add(userId));
      }
    } catch (error) {
      console.error('Failed to send friend request:', error);
    } finally {
      setSendingTo(null);
    }
  };

  /**
   * Get the button text for a user
   */
  const getButtonText = (user: UserSearchResult): string => {
    if (user.isFriend) {
      return 'Friends';
    }
    if (user.isPending || sentRequests.has(user.id)) {
      return 'Sent!';
    }
    return 'Add';
  };

  /**
   * Check if add button should be disabled
   */
  const isButtonDisabled = (user: UserSearchResult): boolean => {
    return (
      user.isFriend ||
      user.isPending ||
      sentRequests.has(user.id) ||
      sendingTo === user.id
    );
  };

  /**
   * Reset state when modal is closed
   */
  const handleClose = () => {
    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    // Reset state
    setSearchQuery('');
    setSearchResults([]);
    setSearching(false);
    setSendingTo(null);
    setSentRequests(new Set());
    // Call parent close handler
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Friend</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleClose}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonSearchbar
          value={searchQuery}
          onIonInput={handleSearchChange}
          placeholder="Search by username"
          debounce={0}
          animated
          aria-label="Search for friends by username"
        />

        {searching ? (
          <div className="search-loading" style={{ padding: '2rem 0' }}>
            <LoadingSpinner size="default" aria-label="Searching for users" />
          </div>
        ) : (
          <IonList>
            {searchResults.map((user) => (
              <IonItem key={user.id} lines="full">
                <IonAvatar slot="start">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={`${user.name}'s avatar`} />
                  ) : (
                    <div
                      className="avatar-placeholder"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'var(--ion-color-light)',
                      }}
                    >
                      <IonIcon icon={person} aria-hidden="true" />
                    </div>
                  )}
                </IonAvatar>
                <IonLabel>
                  <h2>{user.name}</h2>
                </IonLabel>
                <IonButton
                  slot="end"
                  fill={isButtonDisabled(user) ? 'outline' : 'solid'}
                  size="small"
                  disabled={isButtonDisabled(user)}
                  onClick={() => handleSendRequest(user.id)}
                  aria-label={
                    user.isFriend
                      ? `${user.name} is already a friend`
                      : user.isPending || sentRequests.has(user.id)
                        ? `Friend request sent to ${user.name}`
                        : `Send friend request to ${user.name}`
                  }
                >
                  {sendingTo === user.id ? (
                    <LoadingSpinner size="small" color="primary" />
                  ) : (
                    getButtonText(user)
                  )}
                </IonButton>
              </IonItem>
            ))}
            {searchQuery.trim() &&
              !searching &&
              searchResults.length === 0 && (
                <IonItem lines="none">
                  <IonLabel className="ion-text-center" color="medium">
                    <p>No users found for &quot;{searchQuery}&quot;</p>
                  </IonLabel>
                </IonItem>
              )}
          </IonList>
        )}
      </IonContent>
    </IonModal>
  );
}
