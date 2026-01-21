import { IonList, IonSkeletonText, IonItem, IonAvatar, IonLabel } from '@ionic/react';
import { peopleOutline } from 'ionicons/icons';
import { FriendCard } from './FriendCard';
import { EmptyState } from '@/components/common';
import type { Friend } from '@/types/social.types';

/**
 * Props for FriendsList component
 */
export interface FriendsListProps {
  /** Array of friends to display */
  friends: Friend[];
  /** Callback when a friend card is tapped */
  onFriendTap: (friend: Friend) => void;
  /** Whether the list is loading */
  loading?: boolean;
}

/**
 * Loading skeleton for friends list
 */
function FriendsListSkeleton() {
  return (
    <IonList>
      {[1, 2, 3].map((key) => (
        <IonItem key={key} lines="none">
          <IonAvatar slot="start">
            <IonSkeletonText animated style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
          </IonAvatar>
          <IonLabel>
            <h2>
              <IonSkeletonText animated style={{ width: '60%', height: '16px' }} />
            </h2>
            <p>
              <IonSkeletonText animated style={{ width: '40%', height: '14px' }} />
            </p>
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
}

/**
 * FriendsList - Displays a list of friends with loading and empty states
 *
 * Renders FriendCard for each friend, shows a skeleton loader when loading,
 * and displays an EmptyState when the friends array is empty.
 *
 * @example
 * ```tsx
 * // With friends
 * <FriendsList
 *   friends={friendsArray}
 *   onFriendTap={(friend) => handleFriendClick(friend)}
 *   loading={false}
 * />
 *
 * // Loading state
 * <FriendsList friends={[]} onFriendTap={handleClick} loading={true} />
 *
 * // Empty state
 * <FriendsList friends={[]} onFriendTap={handleClick} loading={false} />
 * ```
 */
export function FriendsList({
  friends,
  onFriendTap,
  loading = false,
}: FriendsListProps) {
  // Show loading skeleton
  if (loading) {
    return <FriendsListSkeleton />;
  }

  // Show empty state when no friends
  if (friends.length === 0) {
    return (
      <EmptyState
        icon={peopleOutline}
        title="No friends yet"
        description="Start connecting with friends to see their steps and progress."
      />
    );
  }

  // Render friends list
  return (
    <IonList className="friends-list ion-no-padding">
      {friends.map((friend) => (
        <FriendCard
          key={friend.id}
          friend={friend}
          onTap={onFriendTap}
        />
      ))}
    </IonList>
  );
}
