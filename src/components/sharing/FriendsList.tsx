/**
 * FriendsList component displays a list of friends.
 * Shows empty state when no friends exist.
 */

import React from 'react';
import { IonList, IonText, IonIcon } from '@ionic/react';
import { people } from 'ionicons/icons';
import { FriendCard } from './FriendCard';
import type { Friend } from '../../types/social.types';

export interface FriendsListProps {
  /** Array of friends to display */
  friends: Friend[];
  /** Callback when a friend is clicked */
  onFriendClick?: (friend: Friend) => void;
  /** Custom empty state message */
  emptyMessage?: string;
}

/**
 * List component for displaying friends
 */
export const FriendsList: React.FC<FriendsListProps> = ({
  friends,
  onFriendClick,
  emptyMessage = 'No friends yet. Add some friends to see their progress!',
}) => {
  if (friends.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1rem',
          textAlign: 'center',
        }}
      >
        <IonIcon
          icon={people}
          style={{
            fontSize: '4rem',
            color: 'var(--ion-color-medium)',
            marginBottom: '1rem',
          }}
        />
        <IonText color="medium">
          <p>{emptyMessage}</p>
        </IonText>
      </div>
    );
  }

  return (
    <IonList>
      {friends.map((friend) => (
        <FriendCard
          key={friend.id}
          friend={friend}
          onClick={onFriendClick}
        />
      ))}
    </IonList>
  );
};
