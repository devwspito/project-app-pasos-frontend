import {
  IonCard,
  IonCardContent,
  IonItem,
  IonAvatar,
  IonLabel,
  IonIcon,
} from '@ionic/react';
import { person, footsteps } from 'ionicons/icons';
import type { Friend } from '@/types/social.types';

/**
 * Props for FriendCard component
 */
export interface FriendCardProps {
  /** Friend data to display */
  friend: Friend;
  /** Callback when the card is tapped */
  onTap: (friend: Friend) => void;
}

/**
 * FriendCard - Displays a single friend with avatar, name, and step count
 *
 * Uses Ionic components for consistent styling. Shows a placeholder avatar
 * (person icon) when no avatar image is available.
 *
 * @example
 * ```tsx
 * <FriendCard
 *   friend={{ id: '1', name: 'John Doe', stepsToday: 5432, ... }}
 *   onTap={(friend) => navigateToFriendProfile(friend.id)}
 * />
 * ```
 */
export function FriendCard({ friend, onTap }: FriendCardProps) {
  const handleClick = () => {
    onTap(friend);
  };

  return (
    <IonCard
      className="friend-card ion-no-margin"
      button
      onClick={handleClick}
      role="button"
      aria-label={`View ${friend.name}'s profile`}
    >
      <IonCardContent className="ion-no-padding">
        <IonItem lines="none" detail={false}>
          <IonAvatar slot="start" className="friend-avatar">
            {friend.avatarUrl ? (
              <img src={friend.avatarUrl} alt={`${friend.name}'s avatar`} />
            ) : (
              <div className="avatar-placeholder">
                <IonIcon icon={person} aria-hidden="true" />
              </div>
            )}
          </IonAvatar>
          <IonLabel>
            <h2 className="friend-name">{friend.name}</h2>
            <p className="friend-steps">
              <IonIcon
                icon={footsteps}
                className="steps-icon"
                aria-hidden="true"
              />
              <span>{friend.stepsToday.toLocaleString()} steps today</span>
            </p>
          </IonLabel>
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
}
