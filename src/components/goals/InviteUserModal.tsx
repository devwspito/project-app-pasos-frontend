/**
 * InviteUserModal component for searching and inviting users to goals.
 * Features debounced search input and invite functionality.
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
  IonBadge,
} from '@ionic/react';
import { personAdd, checkmarkCircle, search, people } from 'ionicons/icons';
import type { UserSearchResult } from '../../types/social.types';
import './InviteUserModal.css';

/** Debounce delay in milliseconds */
const DEBOUNCE_DELAY = 300;

export interface InviteUserModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Goal ID to invite users to */
  goalId: string;
  /** Function to search for users */
  onSearch: (query: string) => Promise<UserSearchResult[]>;
  /** Function to invite a user to the goal */
  onInvite: (userId: string) => Promise<boolean>;
  /** Array of existing member user IDs */
  existingMemberIds: string[];
}

/**
 * Modal for searching users and inviting them to a goal
 */
export const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  goalId: _goalId, // Reserved for future use (analytics/tracking context)
  onSearch,
  onInvite,
  existingMemberIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [invitingTo, setInvitingTo] = useState<string | null>(null);
  const [sentInvites, setSentInvites] = useState<Set<string>>(new Set());

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
   * Handle inviting a user
   */
  const handleInvite = async (userId: string) => {
    setInvitingTo(userId);
    try {
      const success = await onInvite(userId);
      if (success) {
        setSentInvites((prev) => new Set([...prev, userId]));
      }
    } finally {
      setInvitingTo(null);
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
    setInvitingTo(null);
    setSentInvites(new Set());
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
   * Check if a user is already a member
   */
  const isExistingMember = (userId: string): boolean => {
    return existingMemberIds.includes(userId);
  };

  /**
   * Get button state for a user
   */
  const getButtonState = (user: UserSearchResult) => {
    if (isExistingMember(user.id)) {
      return { text: 'Already member', disabled: true, icon: checkmarkCircle, color: 'medium' as const };
    }
    if (sentInvites.has(user.id)) {
      return { text: 'Invited', disabled: true, icon: checkmarkCircle, color: 'success' as const };
    }
    return { text: 'Invite', disabled: false, icon: personAdd, color: 'primary' as const };
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Invite to Goal</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleClose}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding invite-user-content">
        <IonSearchbar
          value={searchQuery}
          onIonInput={(e) => handleSearchChange(e.detail.value || '')}
          placeholder="Search by name or email..."
          debounce={0}
          animated
          className="invite-user-searchbar"
        />

        {searching && (
          <div className="invite-user-status">
            <IonSpinner />
            <IonText color="medium">
              <p>Searching...</p>
            </IonText>
          </div>
        )}

        {!searching && searchQuery.length >= 2 && searchResults.length === 0 && (
          <div className="invite-user-status">
            <IonIcon
              icon={search}
              className="invite-user-status-icon"
            />
            <IonText color="medium">
              <p>No users found for "{searchQuery}"</p>
            </IonText>
          </div>
        )}

        {!searching && searchQuery.length < 2 && (
          <div className="invite-user-status">
            <IonIcon
              icon={people}
              className="invite-user-status-icon"
            />
            <IonText color="medium">
              <p>Enter at least 2 characters to search</p>
            </IonText>
          </div>
        )}

        {searchResults.length > 0 && (
          <IonList className="invite-user-list">
            {searchResults.map((user) => {
              const buttonState = getButtonState(user);
              const isProcessing = invitingTo === user.id;
              const isMember = isExistingMember(user.id);

              return (
                <IonItem key={user.id} className={isMember ? 'invite-user-item-disabled' : ''}>
                  <IonAvatar slot="start" className="invite-user-avatar">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} />
                    ) : (
                      <div className="invite-user-avatar-placeholder">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </IonAvatar>

                  <IonLabel>
                    <h2>{user.name}</h2>
                    {isMember && (
                      <IonBadge color="medium" className="invite-user-member-badge">
                        Already member
                      </IonBadge>
                    )}
                    {user.mutualFriendsCount !== undefined && user.mutualFriendsCount > 0 && !isMember && (
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
                      onClick={() => handleInvite(user.id)}
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
