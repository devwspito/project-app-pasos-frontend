/**
 * GoalCard component for displaying goal summary in a list.
 * Shows name, progress, dates, and member count.
 */

import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonChip,
} from '@ionic/react';
import { people, calendar, checkmarkCircle } from 'ionicons/icons';
import { GoalProgressBar } from './GoalProgressBar';
import type { GroupGoal } from '../../types/goal';

/**
 * Props for GoalCard component
 */
export interface GoalCardProps {
  /** The goal to display */
  goal: GroupGoal;
  /** Click handler for the card */
  onClick: (goal: GroupGoal) => void;
}

/**
 * Calculate days remaining until end date
 */
const getDaysRemaining = (endDate: string): number => {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

/**
 * Format date for display (e.g., "Jan 15")
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * GoalCard - Displays a goal summary with progress
 *
 * @example
 * ```tsx
 * <GoalCard
 *   goal={goal}
 *   onClick={(g) => navigate(`/goals/${g.id}`)}
 * />
 * ```
 */
export const GoalCard: React.FC<GoalCardProps> = ({ goal, onClick }) => {
  const daysRemaining = getDaysRemaining(goal.endDate);
  const memberCount = goal.members?.length ?? 1;
  const currentSteps = goal.progress?.currentSteps ?? 0;
  const isComplete = goal.progress?.isComplete ?? currentSteps >= goal.targetSteps;

  return (
    <IonCard
      button
      onClick={() => onClick(goal)}
      style={{ cursor: 'pointer' }}
    >
      <IonCardHeader>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IonCardTitle style={{ fontSize: '1.1rem' }}>
            {goal.name}
          </IonCardTitle>
          {isComplete && (
            <IonBadge color="success">
              <IonIcon icon={checkmarkCircle} style={{ marginRight: '4px' }} />
              Complete
            </IonBadge>
          )}
        </div>
        {goal.description && (
          <p style={{ color: 'var(--ion-color-medium)', fontSize: '0.875rem', margin: '0.5rem 0 0' }}>
            {goal.description.length > 80
              ? `${goal.description.substring(0, 80)}...`
              : goal.description}
          </p>
        )}
      </IonCardHeader>

      <IonCardContent>
        <GoalProgressBar
          currentSteps={currentSteps}
          targetSteps={goal.targetSteps}
          size="small"
        />

        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginTop: '0.75rem'
        }}>
          <IonChip outline style={{ margin: 0 }}>
            <IonIcon icon={people} />
            <span>{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
          </IonChip>

          <IonChip outline style={{ margin: 0 }}>
            <IonIcon icon={calendar} />
            <span>
              {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
            </span>
          </IonChip>

          {!isComplete && daysRemaining > 0 && (
            <IonChip
              color={daysRemaining <= 3 ? 'warning' : 'primary'}
              style={{ margin: 0 }}
            >
              <span>
                {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
              </span>
            </IonChip>
          )}

          {!isComplete && daysRemaining === 0 && (
            <IonChip color="danger" style={{ margin: 0 }}>
              <span>Ends today</span>
            </IonChip>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
};
