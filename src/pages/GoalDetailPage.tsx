/**
 * GoalDetailPage displays detailed information about a specific goal.
 * Shows progress, stats, and goal management actions.
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
  IonActionSheet,
  RefresherEventDetail,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import {
  flagOutline,
  checkmarkCircleOutline,
  pauseCircleOutline,
  playCircleOutline,
  closeCircleOutline,
  ellipsisHorizontal,
  calendarOutline,
  trendingUpOutline,
  fitnessOutline,
  flameOutline,
  timeOutline,
  starOutline,
  star,
} from 'ionicons/icons';
import { GoalProgressBar } from '../components/goals/GoalProgressBar';
import { useGoals } from '../hooks/useGoals';
import type { GoalType, GoalStatus } from '../types/goal.types';
import { format, differenceInDays, parseISO } from 'date-fns';

interface RouteParams {
  goalId: string;
}

/**
 * Map goal type to display label and icon
 */
const goalTypeConfig: Record<GoalType, { label: string; icon: string }> = {
  steps: { label: 'Steps', icon: fitnessOutline },
  distance: { label: 'Distance', icon: trendingUpOutline },
  calories: { label: 'Calories', icon: flameOutline },
  active_minutes: { label: 'Active Minutes', icon: timeOutline },
  streak: { label: 'Streak', icon: flagOutline },
};

/**
 * Map goal status to display config
 */
const statusConfig: Record<GoalStatus, { label: string; color: string }> = {
  active: { label: 'Active', color: 'primary' },
  completed: { label: 'Completed', color: 'success' },
  failed: { label: 'Failed', color: 'danger' },
  paused: { label: 'Paused', color: 'warning' },
  cancelled: { label: 'Cancelled', color: 'medium' },
};

/**
 * Format a number with appropriate units
 */
function formatValue(value: number, type: GoalType): string {
  switch (type) {
    case 'steps':
      return value.toLocaleString();
    case 'distance':
      return `${(value / 1000).toFixed(2)} km`;
    case 'calories':
      return `${value.toLocaleString()} kcal`;
    case 'active_minutes':
      return `${value} min`;
    case 'streak':
      return `${value} days`;
    default:
      return value.toString();
  }
}

/**
 * Page component for viewing goal details and managing a goal
 */
const GoalDetailPage: React.FC = () => {
  const { goalId } = useParams<RouteParams>();
  const {
    selectedGoal,
    loading,
    error,
    getGoal,
    setPrimary,
    completeGoal,
    pauseGoal,
    resumeGoal,
    cancelGoal,
  } = useGoals(false);

  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'complete' | 'cancel' | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  /**
   * Fetch goal data
   */
  const fetchGoal = useCallback(async () => {
    if (!goalId) return;
    await getGoal(goalId);
  }, [goalId, getGoal]);

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchGoal();
    event.detail.complete();
  };

  // Fetch on mount
  useEffect(() => {
    fetchGoal();
  }, [fetchGoal]);

  /**
   * Handle setting goal as primary
   */
  const handleSetPrimary = async () => {
    if (!selectedGoal) return;
    setActionLoading(true);
    const success = await setPrimary(selectedGoal.id);
    setActionLoading(false);
    if (success) {
      await fetchGoal();
    }
  };

  /**
   * Handle pause/resume toggle
   */
  const handlePauseResume = async () => {
    if (!selectedGoal) return;
    setActionLoading(true);
    const success = selectedGoal.status === 'paused'
      ? await resumeGoal(selectedGoal.id)
      : await pauseGoal(selectedGoal.id);
    setActionLoading(false);
    if (success) {
      await fetchGoal();
    }
  };

  /**
   * Handle action confirmation
   */
  const handleConfirmAction = async () => {
    if (!selectedGoal || !confirmAction) return;
    setActionLoading(true);
    let success = false;

    if (confirmAction === 'complete') {
      success = await completeGoal(selectedGoal.id);
    } else if (confirmAction === 'cancel') {
      success = await cancelGoal(selectedGoal.id);
    }

    setActionLoading(false);
    setConfirmAction(null);
    if (success) {
      await fetchGoal();
    }
  };

  /**
   * Get action sheet buttons based on goal status
   */
  const getActionSheetButtons = () => {
    if (!selectedGoal) return [];

    const buttons = [];

    if (selectedGoal.status === 'active') {
      if (!selectedGoal.isPrimary) {
        buttons.push({
          text: 'Set as Primary Goal',
          icon: star,
          handler: handleSetPrimary,
        });
      }
      buttons.push({
        text: 'Mark as Completed',
        icon: checkmarkCircleOutline,
        handler: () => {
          setConfirmAction('complete');
          setShowConfirmAlert(true);
        },
      });
      buttons.push({
        text: 'Pause Goal',
        icon: pauseCircleOutline,
        handler: handlePauseResume,
      });
      buttons.push({
        text: 'Cancel Goal',
        role: 'destructive',
        icon: closeCircleOutline,
        handler: () => {
          setConfirmAction('cancel');
          setShowConfirmAlert(true);
        },
      });
    } else if (selectedGoal.status === 'paused') {
      buttons.push({
        text: 'Resume Goal',
        icon: playCircleOutline,
        handler: handlePauseResume,
      });
      buttons.push({
        text: 'Cancel Goal',
        role: 'destructive',
        icon: closeCircleOutline,
        handler: () => {
          setConfirmAction('cancel');
          setShowConfirmAlert(true);
        },
      });
    }

    buttons.push({
      text: 'Close',
      role: 'cancel',
    });

    return buttons;
  };

  const goalTitle = selectedGoal?.title || 'Goal Details';

  // Calculate days remaining
  const daysRemaining = selectedGoal
    ? Math.max(0, differenceInDays(parseISO(selectedGoal.endDate), new Date()))
    : 0;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/goals" />
          </IonButtons>
          <IonTitle>{goalTitle}</IonTitle>
          {selectedGoal && (selectedGoal.status === 'active' || selectedGoal.status === 'paused') && (
            <IonButtons slot="end">
              <IonButton onClick={() => setShowActionSheet(true)} disabled={actionLoading}>
                <IonIcon slot="icon-only" icon={ellipsisHorizontal} />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {loading && !selectedGoal && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <IonSpinner />
          </div>
        )}

        {error && !selectedGoal && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
            <IonButton onClick={fetchGoal}>Retry</IonButton>
          </div>
        )}

        {selectedGoal && (
          <>
            {/* Status and Type Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <IonChip color={statusConfig[selectedGoal.status].color}>
                  {statusConfig[selectedGoal.status].label}
                </IonChip>
                {selectedGoal.isPrimary && (
                  <IonChip color="warning">
                    <IonIcon icon={star} />
                    Primary
                  </IonChip>
                )}
              </div>
              <IonChip color="medium" outline>
                <IonIcon icon={goalTypeConfig[selectedGoal.type].icon} />
                {goalTypeConfig[selectedGoal.type].label}
              </IonChip>
            </div>

            {/* Progress Card */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Progress</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--ion-color-primary)' }}>
                    {formatValue(selectedGoal.currentValue, selectedGoal.type)}
                  </div>
                  <IonText color="medium">
                    of {formatValue(selectedGoal.targetValue, selectedGoal.type)}
                  </IonText>
                </div>
                <GoalProgressBar
                  progress={selectedGoal.progressPercentage}
                  status={selectedGoal.status}
                  height={12}
                />
              </IonCardContent>
            </IonCard>

            {/* Details Card */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Details</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {selectedGoal.description && (
                  <div style={{ marginBottom: '1rem' }}>
                    <IonText color="dark">
                      <p style={{ margin: 0 }}>{selectedGoal.description}</p>
                    </IonText>
                  </div>
                )}

                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IonIcon icon={calendarOutline} color="primary" />
                    <div>
                      <IonText color="medium" style={{ fontSize: '0.85rem' }}>
                        Start Date
                      </IonText>
                      <br />
                      <IonText>
                        {format(parseISO(selectedGoal.startDate), 'MMM d, yyyy')}
                      </IonText>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IonIcon icon={calendarOutline} color="primary" />
                    <div>
                      <IonText color="medium" style={{ fontSize: '0.85rem' }}>
                        End Date
                      </IonText>
                      <br />
                      <IonText>
                        {format(parseISO(selectedGoal.endDate), 'MMM d, yyyy')}
                      </IonText>
                    </div>
                  </div>

                  {selectedGoal.status === 'active' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <IonIcon icon={timeOutline} color="warning" />
                      <div>
                        <IonText color="medium" style={{ fontSize: '0.85rem' }}>
                          Time Remaining
                        </IonText>
                        <br />
                        <IonText color={daysRemaining <= 3 ? 'warning' : undefined}>
                          {daysRemaining === 0 ? 'Last day!' : `${daysRemaining} days`}
                        </IonText>
                      </div>
                    </div>
                  )}

                  {selectedGoal.completedAt && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <IonIcon icon={checkmarkCircleOutline} color="success" />
                      <div>
                        <IonText color="medium" style={{ fontSize: '0.85rem' }}>
                          Completed On
                        </IonText>
                        <br />
                        <IonText color="success">
                          {format(parseISO(selectedGoal.completedAt), 'MMM d, yyyy')}
                        </IonText>
                      </div>
                    </div>
                  )}
                </div>
              </IonCardContent>
            </IonCard>

            {/* Quick Actions for Active Goals */}
            {selectedGoal.status === 'active' && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                {!selectedGoal.isPrimary && (
                  <IonButton
                    expand="block"
                    fill="outline"
                    style={{ flex: 1 }}
                    onClick={handleSetPrimary}
                    disabled={actionLoading}
                  >
                    <IonIcon slot="start" icon={starOutline} />
                    Set Primary
                  </IonButton>
                )}
                <IonButton
                  expand="block"
                  color="success"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setConfirmAction('complete');
                    setShowConfirmAlert(true);
                  }}
                  disabled={actionLoading}
                >
                  <IonIcon slot="start" icon={checkmarkCircleOutline} />
                  Complete
                </IonButton>
              </div>
            )}

            {/* Resume Button for Paused Goals */}
            {selectedGoal.status === 'paused' && (
              <IonButton
                expand="block"
                color="primary"
                style={{ marginTop: '1rem' }}
                onClick={handlePauseResume}
                disabled={actionLoading}
              >
                <IonIcon slot="start" icon={playCircleOutline} />
                Resume Goal
              </IonButton>
            )}
          </>
        )}

        {/* Action Sheet */}
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          header="Goal Actions"
          buttons={getActionSheetButtons()}
        />

        {/* Confirmation Alert */}
        <IonAlert
          isOpen={showConfirmAlert}
          onDidDismiss={() => {
            setShowConfirmAlert(false);
            setConfirmAction(null);
          }}
          header={confirmAction === 'complete' ? 'Complete Goal?' : 'Cancel Goal?'}
          message={
            confirmAction === 'complete'
              ? 'Are you sure you want to mark this goal as completed?'
              : 'Are you sure you want to cancel this goal? This cannot be undone.'
          }
          buttons={[
            {
              text: 'No',
              role: 'cancel',
            },
            {
              text: 'Yes',
              handler: handleConfirmAction,
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default GoalDetailPage;
