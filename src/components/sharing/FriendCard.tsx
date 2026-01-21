/**
 * FriendCard component displays a single friend's information.
 * Shows avatar, name, steps today, and status indicators.
 */

import React from 'react';
import {
  IonItem,
  IonAvatar,
  IonLabel,
  IonBadge,
  IonIcon,
  IonNote,
} from '@ionic/react';
import { chevronForward, footsteps, flame, checkmarkCircle } from 'ionicons/icons';
import type { Friend } from '../../types/social.types';

export interface FriendCardProps {
  /** Friend data to display */
  friend: Friend;
  /** Click handler for navigation */
  onClick?: (friend: Friend) => void;
}

/**
 * Card component for displaying a friend in the friends list
 */
export const FriendCard: React.FC<FriendCardProps> = ({ friend, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(friend);
    }
  };

  const goalProgress = friend.dailyGoal && friend.dailyGoal > 0
    ? Math.min(100, Math.round((friend.stepsToday / friend.dailyGoal) * 100))
    : 0;

  return (
    <IonItem
      button
      detail={false}
      onClick={handleClick}
      className="friend-card"
    >
      <IonAvatar slot="start">
        {friend.avatarUrl ? (
          <img src={friend.avatarUrl} alt={friend.name} />
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
              fontSize: '1.2rem',
            }}
          >
            {friend.name.charAt(0).toUpperCase()}
          </div>
        )}
      </IonAvatar>

      <IonLabel>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {friend.name}
          {friend.isActive && (
            <IonIcon
              icon={checkmarkCircle}
              color="success"
              style={{ fontSize: '0.9rem' }}
            />
          )}
        </h2>
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <IonIcon icon={footsteps} color="primary" />
          {friend.stepsToday.toLocaleString()} steps today
          {friend.dailyGoal && (
            <IonNote>({goalProgress}%)</IonNote>
          )}
        </p>
      </IonLabel>

      {friend.currentStreak !== undefined && friend.currentStreak > 0 && (
        <IonBadge color="warning" slot="end" style={{ marginRight: '0.5rem' }}>
          <IonIcon icon={flame} style={{ marginRight: '0.25rem' }} />
          {friend.currentStreak}
        </IonBadge>
      )}

      <IonIcon icon={chevronForward} slot="end" color="medium" />
    </IonItem>
  );
};
