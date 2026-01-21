/**
 * GoalCard component for displaying a single goal in the list.
 * Shows goal title, type, progress, and status.
 */

import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonBadge,
  IonProgressBar,
  IonIcon,
  IonChip,
} from '@ionic/react';
import {
  footstepsOutline,
  flameOutline,
  timerOutline,
  trophyOutline,
  navigateOutline,
  star,
} from 'ionicons/icons';
import type { Goal, GoalType, GoalStatus } from '../../types/goal.types';

export interface GoalCardProps {
  /** The goal to display */
  goal: Goal;
  /** Callback when card is clicked */
  onClick?: (goal: Goal) => void;
}

/** Icon mapping by goal type */
const GOAL_TYPE_ICONS: Record<GoalType, string> = {
  steps: footstepsOutline,
  distance: navigateOutline,
  calories: flameOutline,
  active_minutes: timerOutline,
  streak: trophyOutline,
};

/** Labels for goal types */
const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  steps: 'Steps',
  distance: 'Distance',
  calories: 'Calories',
  active_minutes: 'Active Minutes',
  streak: 'Streak',
};

/** Color mapping by status */
const STATUS_COLORS: Record<GoalStatus, string> = {
  active: 'primary',
  completed: 'success',
  failed: 'danger',
  paused: 'warning',
  cancelled: 'medium',
};

/** Label mapping by status */
const STATUS_LABELS: Record<GoalStatus, string> = {
  active: 'Active',
  completed: 'Completed',
  failed: 'Failed',
  paused: 'Paused',
  cancelled: 'Cancelled',
};

/**
 * Format number with commas
 */
function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * GoalCard - Displays a single goal with progress
 */
export const GoalCard: React.FC<GoalCardProps> = ({ goal, onClick }) => {
  const progressValue = Math.min(goal.progressPercentage / 100, 1);
  const icon = GOAL_TYPE_ICONS[goal.type];
  const typeLabel = GOAL_TYPE_LABELS[goal.type];
  const statusColor = STATUS_COLORS[goal.status];
  const statusLabel = STATUS_LABELS[goal.status];

  const handleClick = () => {
    if (onClick) {
      onClick(goal);
    }
  };

  return (
    <IonCard
      onClick={handleClick}
      button={!!onClick}
      className="goal-card"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <IonCardHeader>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IonIcon icon={icon} color="primary" style={{ fontSize: '1.5rem' }} />
            <IonCardTitle style={{ fontSize: '1.1rem' }}>
              {goal.title}
              {goal.isPrimary && (
                <IonIcon
                  icon={star}
                  color="warning"
                  style={{ marginLeft: '0.5rem', fontSize: '1rem' }}
                />
              )}
            </IonCardTitle>
          </div>
          <IonBadge color={statusColor}>{statusLabel}</IonBadge>
        </div>
        <IonCardSubtitle>
          <IonChip outline color="medium" style={{ height: '24px', margin: '0.25rem 0' }}>
            {typeLabel}
          </IonChip>
        </IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>
        {goal.description && (
          <p style={{ color: 'var(--ion-color-medium)', marginBottom: '0.75rem' }}>
            {goal.description}
          </p>
        )}

        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.9rem' }}>
              <strong>{formatNumber(goal.currentValue)}</strong> / {formatNumber(goal.targetValue)}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--ion-color-medium)' }}>
              {Math.round(goal.progressPercentage)}%
            </span>
          </div>
          <IonProgressBar
            value={progressValue}
            color={goal.status === 'completed' ? 'success' : 'primary'}
            style={{ height: '8px', borderRadius: '4px' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--ion-color-medium)' }}>
          <span>Start: {new Date(goal.startDate).toLocaleDateString()}</span>
          <span>End: {new Date(goal.endDate).toLocaleDateString()}</span>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default GoalCard;
