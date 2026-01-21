/**
 * AddFriendModal component for searching and adding friends.
 * Features debounced search input and friend request sending.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonSearchbar,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonSpinner,
  IonText,
  IonIcon,
} from '@ionic/react';
import { personAdd, checkmarkCircle, time, people, search } from 'ionicons/icons';
import type { UserSearchResult } from '../../types/social.types';

/** Debounce delay in milliseconds */
const DEBOUNCE_DELAY = 300;

export interface AddFriendModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Function to search for users */
  onSearch: (query: string) => Promise<UserSearchResult[]>;
  /** Function to send a friend request */
  onSendRequest: (userId: string) => Promise<boolean>;
}

/**
 * Modal for searching users and sending friend requests
 */
export const AddFriendModal: React.FC<AddFriendModalProps> = ({
  isOpen,
  onClose,
  onSearch,
  onSendRequest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Perform search with debouncing
   */
  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await onSearch(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, [onSearch]);

  /**
   * Handle search input change with debounce
   */
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      performSearch(value);
    }, DEBOUNCE_DELAY);
  }, [performSearch]);

  /**
   * Handle sending a friend request
   */
  const handleSendRequest = async (userId: string) => {
    setSendingTo(userId);
    try {
      const success = await onSendRequest(userId);
      if (success) {
        setSentRequests((prev) => new Set([...prev, userId]));
      }
    } finally {
      setSendingTo(null);
    }
  };

  /**
   * Reset state when modal closes
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
    onClose();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  /**
   * Get button text and state for a user
   */
  const getButtonState = (user: UserSearchResult) => {
    if (user.isFriend) {
      return { text: 'Friends', disabled: true, icon: checkmarkCircle, color: 'success' as const };
    }
    if (user.isPending || sentRequests.has(user.id)) {
      return { text: 'Sent!', disabled: true, icon: time, color: 'medium' as const };
    }
    return { text: 'Add', disabled: false, icon: personAdd, color: 'primary' as const };
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
          onIonInput={(e) => handleSearchChange(e.detail.value || '')}
          placeholder="Search by name or email..."
          debounce={0}
          animated
        />

        {searching && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <IonSpinner />
            <IonText color="medium">
              <p>Searching...</p>
            </IonText>
          </div>
        )}

        {!searching && searchQuery.length >= 2 && searchResults.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <IonIcon
              icon={search}
              style={{ fontSize: '3rem', color: 'var(--ion-color-medium)' }}
            />
            <IonText color="medium">
              <p>No users found for "{searchQuery}"</p>
            </IonText>
          </div>
        )}

        {!searching && searchQuery.length < 2 && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <IonIcon
              icon={people}
              style={{ fontSize: '3rem', color: 'var(--ion-color-medium)' }}
            />
            <IonText color="medium">
              <p>Enter at least 2 characters to search</p>
            </IonText>
          </div>
        )}

        {searchResults.length > 0 && (
          <IonList>
            {searchResults.map((user) => {
              const buttonState = getButtonState(user);
              const isProcessing = sendingTo === user.id;

              return (
                <IonItem key={user.id}>
                  <IonAvatar slot="start">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: 'var(--ion-color-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </IonAvatar>

                  <IonLabel>
                    <h2>{user.name}</h2>
                    {user.mutualFriendsCount !== undefined && user.mutualFriendsCount > 0 && (
                      <p>{user.mutualFriendsCount} mutual friend{user.mutualFriendsCount > 1 ? 's' : ''}</p>
                    )}
                  </IonLabel>

                  {isProcessing ? (
                    <IonSpinner slot="end" />
                  ) : (
                    <IonButton
                      slot="end"
                      size="small"
                      color={buttonState.color}
                      disabled={buttonState.disabled}
                      onClick={() => handleSendRequest(user.id)}
                    >
                      <IonIcon icon={buttonState.icon} slot="start" />
                      {buttonState.text}
                    </IonButton>
                  )}
                </IonItem>
              );
            })}
          </IonList>
        )}
      </IonContent>
    </IonModal>
  );
};
