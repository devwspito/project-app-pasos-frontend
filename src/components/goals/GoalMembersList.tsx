/**
 * GoalMembersList component displays a list of goal members.
 * Shows member avatars, usernames, status badges, and contribution counts.
 */

import React from 'react';
import {
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonBadge,
  IonButton,
  IonIcon,
  IonText,
} from '@ionic/react';
import { personAdd, people } from 'ionicons/icons';
import type { GroupGoalMember } from '../../types/goal';
import './GoalMembersList.css';

export interface GoalMembersListProps {
  /** Array of members to display */
  members: GroupGoalMember[];
  /** Owner's user ID */
  ownerId: string;
  /** Current logged-in user's ID */
  currentUserId: string;
  /** Callback when invite button is clicked (only shown if currentUserId === ownerId) */
  onInviteClick?: () => void;
  /** Custom empty state message */
  emptyMessage?: string;
}

/**
 * Get badge color based on member status
 */
const getBadgeColor = (
  isOwner: boolean,
  isActive: boolean
): 'warning' | 'success' | 'medium' => {
  if (isOwner) return 'warning';
  if (isActive) return 'success';
  return 'medium';
};

/**
 * Get badge text based on member status
 */
const getBadgeText = (isOwner: boolean, isActive: boolean): string => {
  if (isOwner) return 'Owner';
  if (isActive) return 'Active';
  return 'Pending';
};

/**
 * Format step count with commas
 */
const formatSteps = (steps: number): string => {
  return steps.toLocaleString();
};

/**
 * List component for displaying goal members
 */
export const GoalMembersList: React.FC<GoalMembersListProps> = ({
  members,
  ownerId,
  currentUserId,
  onInviteClick,
  emptyMessage = 'No members yet. Invite friends to join this goal!',
}) => {
  const isOwner = currentUserId === ownerId;

  if (members.length === 0) {
    return (
      <div className="goal-members-empty">
        <IonIcon
          icon={people}
          className="goal-members-empty-icon"
        />
        <IonText color="medium">
          <p>{emptyMessage}</p>
        </IonText>
        {isOwner && onInviteClick && (
          <IonButton onClick={onInviteClick} fill="outline" size="small">
            <IonIcon icon={personAdd} slot="start" />
            Invite Members
          </IonButton>
        )}
      </div>
    );
  }

  return (
    <div className="goal-members-container">
      {isOwner && onInviteClick && (
        <div className="goal-members-header">
          <IonText color="medium">
            <p className="goal-members-count">{members.length} member{members.length !== 1 ? 's' : ''}</p>
          </IonText>
          <IonButton
            onClick={onInviteClick}
            fill="outline"
            size="small"
            className="goal-members-invite-btn"
          >
            <IonIcon icon={personAdd} slot="start" />
            Invite
          </IonButton>
        </div>
      )}

      <IonList className="goal-members-list">
        {members.map((member) => {
          const memberIsOwner = member.userId === ownerId;
          const isActive = member.contribution > 0;
          const badgeColor = getBadgeColor(memberIsOwner, isActive);
          const badgeText = getBadgeText(memberIsOwner, isActive);

          return (
            <IonItem key={member.userId} className="goal-member-item">
              <IonAvatar slot="start" className="goal-member-avatar">
                <div className="goal-member-avatar-placeholder">
                  {member.username.charAt(0).toUpperCase()}
                </div>
              </IonAvatar>

              <IonLabel>
                <h2 className="goal-member-username">{member.username}</h2>
                <p className="goal-member-contribution">
                  {formatSteps(member.contribution)} steps contributed
                </p>
              </IonLabel>

              <IonBadge color={badgeColor} slot="end" className="goal-member-badge">
                {badgeText}
              </IonBadge>
            </IonItem>
          );
        })}
      </IonList>
    </div>
  );
};
