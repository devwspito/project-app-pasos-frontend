/**
 * GoalDetailPage displays detailed information about a specific goal.
 * Shows goal progress, status, edit functionality, and status updates.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonProgressBar,
  IonChip,
  IonSpinner,
  IonText,
  IonAlert,
  IonActionSheet,
  RefresherEventDetail,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import {
  footstepsOutline,
  flameOutline,
  timerOutline,
  trophyOutline,
  navigateOutline,
  ellipsisVertical,
  star,
  starOutline,
  pauseOutline,
  playOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
} from 'ionicons/icons';
import { useGoals } from '../hooks/useGoals';
import type { Goal, GoalType, GoalStatus, UpdateGoalInput } from '../types/goal.types';

interface RouteParams {
  goalId: string;
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
 * Format date for display
 */
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Calculate days remaining until end date
 */
function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

/**
 * Page component for viewing and editing a goal's details
 */
const GoalDetailPage: React.FC = () => {
  const { goalId } = useParams<RouteParams>();
  const { getGoal, updateGoal } = useGoals(false);

  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showStatusAlert, setShowStatusAlert] = useState(false);
  const [showPrimaryAlert, setShowPrimaryAlert] = useState(false);

  /**
   * Fetch goal details
   */
  const fetchGoal = useCallback(async () => {
    if (!goalId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await getGoal(goalId);
      if (result) {
        setGoal(result);
      } else {
        setError('Unable to load goal details');
      }
    } catch (err) {
      setError('Failed to load goal details');
      console.error('Error fetching goal:', err);
    } finally {
      setLoading(false);
    }
  }, [goalId, getGoal]);

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchGoal();
    event.detail.complete();
  };

  /**
   * Handle goal update
   */
  const handleUpdateGoal = useCallback(async (input: UpdateGoalInput): Promise<boolean> => {
    if (!goalId || !goal) return false;

    setUpdating(true);
    try {
      const result = await updateGoal(goalId, input);
      if (result) {
        setGoal(result);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating goal:', err);
      return false;
    } finally {
      setUpdating(false);
    }
  }, [goalId, goal, updateGoal]);

  /**
   * Toggle pause/resume goal
   */
  const handleTogglePause = useCallback(async () => {
    if (!goal) return;

    const newStatus: GoalStatus = goal.status === 'paused' ? 'active' : 'paused';
    await handleUpdateGoal({ status: newStatus });
  }, [goal, handleUpdateGoal]);

  /**
   * Mark goal as completed
   */
  const handleMarkComplete = useCallback(async () => {
    await handleUpdateGoal({ status: 'completed' });
    setShowStatusAlert(false);
  }, [handleUpdateGoal]);

  /**
   * Cancel goal
   */
  const handleCancelGoal = useCallback(async () => {
    await handleUpdateGoal({ status: 'cancelled' });
    setShowStatusAlert(false);
  }, [handleUpdateGoal]);

  /**
   * Toggle primary goal status
   */
  const handleTogglePrimary = useCallback(async () => {
    if (!goal) return;
    await handleUpdateGoal({ isPrimary: !goal.isPrimary });
    setShowPrimaryAlert(false);
  }, [goal, handleUpdateGoal]);

  // Fetch on mount
  useEffect(() => {
    fetchGoal();
  }, [fetchGoal]);

  const progressValue = goal ? Math.min(goal.progressPercentage / 100, 1) : 0;
  const icon = goal ? GOAL_TYPE_ICONS[goal.type] : footstepsOutline;
  const typeLabel = goal ? GOAL_TYPE_LABELS[goal.type] : '';
  const statusColor = goal ? STATUS_COLORS[goal.status] : 'medium';
  const statusLabel = goal ? STATUS_LABELS[goal.status] : '';
  const daysRemaining = goal ? getDaysRemaining(goal.endDate) : 0;
  const isEditable = goal && (goal.status === 'active' || goal.status === 'paused');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/goals" />
          </IonButtons>
          <IonTitle>{goal?.title || 'Goal Details'}</IonTitle>
          {isEditable && (
            <IonButtons slot="end">
              <IonButton onClick={() => setShowActionSheet(true)} disabled={updating}>
                {updating ? <IonSpinner name="crescent" /> : <IonIcon icon={ellipsisVertical} />}
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {loading && !goal && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <IonSpinner />
          </div>
        )}

        {error && !goal && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
            <IonButton fill="outline" onClick={fetchGoal}>
              Try Again
            </IonButton>
          </div>
        )}

        {goal && (
          <>
            {/* Goal Header Card */}
            <IonCard>
              <IonCardHeader>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <IonIcon icon={icon} color="primary" style={{ fontSize: '2rem' }} />
                  <div style={{ flex: 1 }}>
                    <IonCardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {goal.title}
                      {goal.isPrimary && (
                        <IonIcon icon={star} color="warning" style={{ fontSize: '1.2rem' }} />
                      )}
                    </IonCardTitle>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <IonChip outline color="medium" style={{ height: '24px', margin: 0 }}>
                        {typeLabel}
                      </IonChip>
                      <IonBadge color={statusColor}>{statusLabel}</IonBadge>
                    </div>
                  </div>
                </div>
              </IonCardHeader>

              <IonCardContent>
                {goal.description && (
                  <p style={{ color: 'var(--ion-color-medium)', marginBottom: '1rem' }}>
                    {goal.description}
                  </p>
                )}

                {/* Progress Section */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                      {formatNumber(goal.currentValue)}
                    </span>
                    <span style={{ color: 'var(--ion-color-medium)', alignSelf: 'flex-end' }}>
                      / {formatNumber(goal.targetValue)}
                    </span>
                  </div>
                  <IonProgressBar
                    value={progressValue}
                    color={goal.status === 'completed' ? 'success' : 'primary'}
                    style={{ height: '12px', borderRadius: '6px' }}
                  />
                  <div style={{
                    textAlign: 'center',
                    marginTop: '0.5rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: progressValue >= 1 ? 'var(--ion-color-success)' : 'var(--ion-color-primary)'
                  }}>
                    {Math.round(goal.progressPercentage)}% Complete
                  </div>
                </div>

                {/* Date Information */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: 'var(--ion-color-light)',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <IonText color="medium">
                      <p style={{ margin: 0, fontSize: '0.8rem' }}>Start Date</p>
                    </IonText>
                    <p style={{ margin: '0.25rem 0 0', fontWeight: '500' }}>
                      {formatDate(goal.startDate)}
                    </p>
                  </div>
                  <div>
                    <IonText color="medium">
                      <p style={{ margin: 0, fontSize: '0.8rem' }}>End Date</p>
                    </IonText>
                    <p style={{ margin: '0.25rem 0 0', fontWeight: '500' }}>
                      {formatDate(goal.endDate)}
                    </p>
                  </div>
                </div>

                {/* Days Remaining / Status Message */}
                {goal.status === 'active' && (
                  <div style={{
                    textAlign: 'center',
                    padding: '0.75rem',
                    backgroundColor: 'var(--ion-color-primary-shade)',
                    borderRadius: '8px',
                    color: 'white'
                  }}>
                    <strong>{daysRemaining}</strong> {daysRemaining === 1 ? 'day' : 'days'} remaining
                  </div>
                )}

                {goal.status === 'completed' && goal.completedAt && (
                  <div style={{
                    textAlign: 'center',
                    padding: '0.75rem',
                    backgroundColor: 'var(--ion-color-success-shade)',
                    borderRadius: '8px',
                    color: 'white'
                  }}>
                    Completed on {formatDate(goal.completedAt)}
                  </div>
                )}

                {goal.status === 'paused' && (
                  <div style={{
                    textAlign: 'center',
                    padding: '0.75rem',
                    backgroundColor: 'var(--ion-color-warning-shade)',
                    borderRadius: '8px',
                    color: 'white'
                  }}>
                    Goal is currently paused
                  </div>
                )}
              </IonCardContent>
            </IonCard>

            {/* Quick Actions Card */}
            {isEditable && (
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle style={{ fontSize: '1rem' }}>Quick Actions</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <IonButton
                      expand="block"
                      fill="outline"
                      onClick={handleTogglePause}
                      disabled={updating}
                    >
                      <IonIcon
                        icon={goal.status === 'paused' ? playOutline : pauseOutline}
                        slot="start"
                      />
                      {goal.status === 'paused' ? 'Resume Goal' : 'Pause Goal'}
                    </IonButton>

                    <IonButton
                      expand="block"
                      fill="outline"
                      onClick={() => setShowPrimaryAlert(true)}
                      disabled={updating}
                    >
                      <IonIcon
                        icon={goal.isPrimary ? starOutline : star}
                        slot="start"
                      />
                      {goal.isPrimary ? 'Remove as Primary' : 'Set as Primary'}
                    </IonButton>

                    <IonButton
                      expand="block"
                      color="success"
                      onClick={() => setShowStatusAlert(true)}
                      disabled={updating}
                    >
                      <IonIcon icon={checkmarkCircleOutline} slot="start" />
                      Mark as Completed
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            )}

            {/* Goal Details Card */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle style={{ fontSize: '1rem' }}>Goal Details</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IonText color="medium">Period</IonText>
                    <span style={{ textTransform: 'capitalize' }}>{goal.period}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IonText color="medium">Created</IonText>
                    <span>{formatDate(goal.createdAt)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IonText color="medium">Last Updated</IonText>
                    <span>{formatDate(goal.updatedAt)}</span>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </>
        )}

        {/* Action Sheet */}
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          header="Goal Actions"
          buttons={[
            {
              text: goal?.status === 'paused' ? 'Resume Goal' : 'Pause Goal',
              icon: goal?.status === 'paused' ? playOutline : pauseOutline,
              handler: handleTogglePause,
            },
            {
              text: goal?.isPrimary ? 'Remove as Primary' : 'Set as Primary',
              icon: goal?.isPrimary ? starOutline : star,
              handler: () => setShowPrimaryAlert(true),
            },
            {
              text: 'Mark as Completed',
              icon: checkmarkCircleOutline,
              handler: () => setShowStatusAlert(true),
            },
            {
              text: 'Cancel Goal',
              icon: closeCircleOutline,
              role: 'destructive',
              handler: handleCancelGoal,
            },
            {
              text: 'Close',
              role: 'cancel',
            },
          ]}
        />

        {/* Status Change Alert */}
        <IonAlert
          isOpen={showStatusAlert}
          onDidDismiss={() => setShowStatusAlert(false)}
          header="Complete Goal"
          message="Are you sure you want to mark this goal as completed? This action cannot be undone."
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'Complete',
              handler: handleMarkComplete,
            },
          ]}
        />

        {/* Primary Alert */}
        <IonAlert
          isOpen={showPrimaryAlert}
          onDidDismiss={() => setShowPrimaryAlert(false)}
          header={goal?.isPrimary ? 'Remove Primary' : 'Set as Primary'}
          message={
            goal?.isPrimary
              ? 'Remove this goal as your primary goal?'
              : 'Set this goal as your primary goal? This will be shown prominently on your dashboard.'
          }
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'Confirm',
              handler: handleTogglePrimary,
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default GoalDetailPage;
