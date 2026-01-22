/**
 * GoalDetailPage displays detailed information about a specific goal.
 * Shows progress, history, and goal management actions.
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
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonChip,
  IonAlert,
  RefresherEventDetail,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import {
  flagOutline,
  pauseOutline,
  playOutline,
  checkmarkCircleOutline,
  calendarOutline,
  trendingUpOutline,
  flameOutline,
  timeOutline,
} from 'ionicons/icons';
import { useGoals, GoalDetailResponse } from '../hooks/useGoals';
import { GoalProgressBar } from '../components/goals/GoalProgressBar';
import type { GoalStatus, GoalType } from '../types/goal.types';

interface RouteParams {
  goalId: string;
}

/**
 * Get display name for goal type
 */
function getGoalTypeLabel(type: GoalType): string {
  switch (type) {
    case 'steps':
      return 'Steps';
    case 'distance':
      return 'Distance';
    case 'calories':
      return 'Calories';
    case 'active_minutes':
      return 'Active Minutes';
    case 'streak':
      return 'Streak';
    default:
      return type;
  }
}

/**
 * Get status chip color
 */
function getStatusColor(status: GoalStatus): string {
  switch (status) {
    case 'active':
      return 'primary';
    case 'completed':
      return 'success';
    case 'failed':
      return 'danger';
    case 'paused':
      return 'warning';
    case 'cancelled':
      return 'medium';
    default:
      return 'medium';
  }
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Calculate days remaining
 */
function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Page component for viewing and managing a specific goal
 */
const GoalDetailPage: React.FC = () => {
  const { goalId } = useParams<RouteParams>();
  const history = useHistory();
  const { getGoalById, completeGoal, pauseGoal, resumeGoal } = useGoals(false);

  const [goalDetails, setGoalDetails] = useState<GoalDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCompleteAlert, setShowCompleteAlert] = useState(false);
  const [showPauseAlert, setShowPauseAlert] = useState(false);

  /**
   * Fetch goal details
   */
  const fetchGoalDetails = useCallback(async () => {
    if (!goalId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await getGoalById(goalId);
      if (result) {
        setGoalDetails(result);
      } else {
        setError('Unable to load goal data');
      }
    } catch (err) {
      setError('Failed to load goal data');
      console.error('Error fetching goal details:', err);
    } finally {
      setLoading(false);
    }
  }, [goalId, getGoalById]);

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchGoalDetails();
    event.detail.complete();
  };

  /**
   * Handle complete goal action
   */
  const handleCompleteGoal = async () => {
    if (!goalId) return;

    setActionLoading(true);
    try {
      const success = await completeGoal(goalId);
      if (success) {
        await fetchGoalDetails();
      }
    } catch (err) {
      console.error('Error completing goal:', err);
    } finally {
      setActionLoading(false);
      setShowCompleteAlert(false);
    }
  };

  /**
   * Handle pause/resume goal action
   */
  const handlePauseResume = async () => {
    if (!goalId || !goalDetails) return;

    setActionLoading(true);
    try {
      const success =
        goalDetails.goal.status === 'paused'
          ? await resumeGoal(goalId)
          : await pauseGoal(goalId);
      if (success) {
        await fetchGoalDetails();
      }
    } catch (err) {
      console.error('Error updating goal status:', err);
    } finally {
      setActionLoading(false);
      setShowPauseAlert(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchGoalDetails();
  }, [fetchGoalDetails]);

  const goal = goalDetails?.goal;
  const streak = goalDetails?.streak;
  const progressHistory = goalDetails?.progressHistory || [];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/goals" />
          </IonButtons>
          <IonTitle>{goal?.title || 'Goal Details'}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Loading State */}
        {loading && !goalDetails && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px',
            }}
          >
            <IonSpinner />
          </div>
        )}

        {/* Error State */}
        {error && !goalDetails && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
            <IonButton onClick={() => history.push('/goals')}>
              Back to Goals
            </IonButton>
          </div>
        )}

        {/* Goal Details */}
        {goal && (
          <>
            {/* Header Section */}
            <IonCard>
              <IonCardHeader>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div>
                    <IonCardTitle>{goal.title}</IonCardTitle>
                    <div style={{ marginTop: '8px' }}>
                      <IonChip color={getStatusColor(goal.status)}>
                        {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                      </IonChip>
                      <IonChip color="medium">
                        <IonIcon icon={flagOutline} />
                        {getGoalTypeLabel(goal.type)}
                      </IonChip>
                      {goal.isPrimary && (
                        <IonChip color="tertiary">Primary Goal</IonChip>
                      )}
                    </div>
                  </div>
                </div>
              </IonCardHeader>
              <IonCardContent>
                {goal.description && (
                  <IonText color="medium">
                    <p style={{ marginBottom: '1rem' }}>{goal.description}</p>
                  </IonText>
                )}

                {/* Progress Bar */}
                <GoalProgressBar
                  progress={goal.progressPercentage}
                  currentValue={goal.currentValue}
                  targetValue={goal.targetValue}
                  goalType={goal.type}
                  status={goal.status}
                  showLabel={true}
                  animated={true}
                  height={16}
                />
              </IonCardContent>
            </IonCard>

            {/* Stats Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginTop: '16px',
              }}
            >
              {/* Date Range */}
              <IonCard>
                <IonCardContent style={{ textAlign: 'center', padding: '16px' }}>
                  <IonIcon
                    icon={calendarOutline}
                    style={{
                      fontSize: '24px',
                      color: 'var(--ion-color-primary)',
                      marginBottom: '8px',
                    }}
                  />
                  <IonText color="medium">
                    <p style={{ margin: 0, fontSize: '0.8rem' }}>Duration</p>
                  </IonText>
                  <IonText>
                    <p style={{ margin: '4px 0 0', fontWeight: 500, fontSize: '0.9rem' }}>
                      {formatDate(goal.startDate)}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.8rem' }}>
                      to {formatDate(goal.endDate)}
                    </p>
                  </IonText>
                </IonCardContent>
              </IonCard>

              {/* Days Remaining */}
              <IonCard>
                <IonCardContent style={{ textAlign: 'center', padding: '16px' }}>
                  <IonIcon
                    icon={timeOutline}
                    style={{
                      fontSize: '24px',
                      color: 'var(--ion-color-warning)',
                      marginBottom: '8px',
                    }}
                  />
                  <IonText color="medium">
                    <p style={{ margin: 0, fontSize: '0.8rem' }}>Days Remaining</p>
                  </IonText>
                  <IonText>
                    <p
                      style={{
                        margin: '4px 0 0',
                        fontWeight: 600,
                        fontSize: '1.5rem',
                      }}
                    >
                      {goal.status === 'completed'
                        ? '0'
                        : getDaysRemaining(goal.endDate)}
                    </p>
                  </IonText>
                </IonCardContent>
              </IonCard>

              {/* Current Progress */}
              <IonCard>
                <IonCardContent style={{ textAlign: 'center', padding: '16px' }}>
                  <IonIcon
                    icon={trendingUpOutline}
                    style={{
                      fontSize: '24px',
                      color: 'var(--ion-color-success)',
                      marginBottom: '8px',
                    }}
                  />
                  <IonText color="medium">
                    <p style={{ margin: 0, fontSize: '0.8rem' }}>Progress</p>
                  </IonText>
                  <IonText>
                    <p
                      style={{
                        margin: '4px 0 0',
                        fontWeight: 600,
                        fontSize: '1.5rem',
                        color:
                          goal.progressPercentage >= 100
                            ? 'var(--ion-color-success)'
                            : undefined,
                      }}
                    >
                      {Math.round(goal.progressPercentage)}%
                    </p>
                  </IonText>
                </IonCardContent>
              </IonCard>

              {/* Streak */}
              {streak && (
                <IonCard>
                  <IonCardContent style={{ textAlign: 'center', padding: '16px' }}>
                    <IonIcon
                      icon={flameOutline}
                      style={{
                        fontSize: '24px',
                        color: 'var(--ion-color-danger)',
                        marginBottom: '8px',
                      }}
                    />
                    <IonText color="medium">
                      <p style={{ margin: 0, fontSize: '0.8rem' }}>Current Streak</p>
                    </IonText>
                    <IonText>
                      <p
                        style={{
                          margin: '4px 0 0',
                          fontWeight: 600,
                          fontSize: '1.5rem',
                        }}
                      >
                        {streak.currentStreak} days
                      </p>
                    </IonText>
                  </IonCardContent>
                </IonCard>
              )}
            </div>

            {/* Progress History */}
            {progressHistory.length > 0 && (
              <IonCard style={{ marginTop: '16px' }}>
                <IonCardHeader>
                  <IonCardTitle>Recent Progress</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  {progressHistory.slice(0, 7).map((entry, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 0',
                        borderBottom:
                          index < progressHistory.length - 1
                            ? '1px solid var(--ion-color-light)'
                            : 'none',
                      }}
                    >
                      <IonText color="medium">
                        <span>{formatDate(entry.date)}</span>
                      </IonText>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IonText>
                          <span style={{ fontWeight: 500 }}>
                            {entry.value.toLocaleString()}
                          </span>
                        </IonText>
                        <IonChip
                          color={entry.percentage >= 100 ? 'success' : 'primary'}
                          style={{ minHeight: '24px', fontSize: '0.75rem' }}
                        >
                          {Math.round(entry.percentage)}%
                        </IonChip>
                      </div>
                    </div>
                  ))}
                </IonCardContent>
              </IonCard>
            )}

            {/* Action Buttons */}
            {goal.status === 'active' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginTop: '24px',
                  paddingBottom: '24px',
                }}
              >
                <IonButton
                  expand="block"
                  color="success"
                  onClick={() => setShowCompleteAlert(true)}
                  disabled={actionLoading}
                >
                  <IonIcon icon={checkmarkCircleOutline} slot="start" />
                  Mark as Completed
                </IonButton>
                <IonButton
                  expand="block"
                  color="warning"
                  fill="outline"
                  onClick={() => setShowPauseAlert(true)}
                  disabled={actionLoading}
                >
                  <IonIcon icon={pauseOutline} slot="start" />
                  Pause Goal
                </IonButton>
              </div>
            )}

            {goal.status === 'paused' && (
              <div style={{ marginTop: '24px', paddingBottom: '24px' }}>
                <IonButton
                  expand="block"
                  color="primary"
                  onClick={() => setShowPauseAlert(true)}
                  disabled={actionLoading}
                >
                  <IonIcon icon={playOutline} slot="start" />
                  Resume Goal
                </IonButton>
              </div>
            )}

            {/* Complete Alert */}
            <IonAlert
              isOpen={showCompleteAlert}
              onDidDismiss={() => setShowCompleteAlert(false)}
              header="Complete Goal"
              message="Are you sure you want to mark this goal as completed?"
              buttons={[
                {
                  text: 'Cancel',
                  role: 'cancel',
                },
                {
                  text: 'Complete',
                  handler: handleCompleteGoal,
                },
              ]}
            />

            {/* Pause/Resume Alert */}
            <IonAlert
              isOpen={showPauseAlert}
              onDidDismiss={() => setShowPauseAlert(false)}
              header={goal.status === 'paused' ? 'Resume Goal' : 'Pause Goal'}
              message={
                goal.status === 'paused'
                  ? 'Do you want to resume tracking this goal?'
                  : 'Pausing will stop progress tracking. You can resume anytime.'
              }
              buttons={[
                {
                  text: 'Cancel',
                  role: 'cancel',
                },
                {
                  text: goal.status === 'paused' ? 'Resume' : 'Pause',
                  handler: handlePauseResume,
                },
              ]}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default GoalDetailPage;
