/**
 * Goals page component.
 * Shows fitness goals list with empty state and create modal.
 */

import React, { useState, useCallback } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  RefresherEventDetail,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { add, flagOutline } from 'ionicons/icons';
import { useGoals } from '../hooks/useGoals';
import { CreateGoalModal, GoalCard } from '../components/goals';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import type { CreateGoalInput, Goal } from '../types/goal.types';

/**
 * Goals page - displays user's fitness goals
 */
const Goals: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const history = useHistory();
  const {
    goals,
    loading,
    error,
    refetch,
    createGoal,
  } = useGoals();

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = useCallback(
    async (event: CustomEvent<RefresherEventDetail>) => {
      await refetch();
      event.detail.complete();
    },
    [refetch]
  );

  /**
   * Handle goal creation
   */
  const handleCreateGoal = useCallback(
    async (input: CreateGoalInput): Promise<boolean> => {
      const result = await createGoal(input);
      return result !== null;
    },
    [createGoal]
  );

  /**
   * Handle goal card click - navigate to detail
   */
  const handleGoalClick = useCallback((goal: Goal) => {
    history.push(`/goals/${goal.id}`);
  }, [history]);

  /**
   * Open create modal
   */
  const openCreateModal = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  /**
   * Close create modal
   */
  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false);
  }, []);

  /**
   * Render loading state
   */
  if (loading && goals.length === 0) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Goals</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem' }}>
            <LoadingSpinner size="large" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  /**
   * Render error state
   */
  if (error && goals.length === 0) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Goals</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <EmptyState
            icon={flagOutline}
            title="Unable to load goals"
            description={error}
            actionLabel="Try Again"
            onAction={refetch}
          />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Goals</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={openCreateModal}>
              <IonIcon slot="icon-only" icon={add} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {goals.length === 0 ? (
          <EmptyState
            icon={flagOutline}
            title="No goals yet"
            description="Create your first fitness goal to start tracking your progress!"
            actionLabel="Create Goal"
            onAction={openCreateModal}
          />
        ) : (
          <div className="goals-list">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onClick={handleGoalClick}
              />
            ))}
          </div>
        )}

        {/* Floating Action Button for creating goals */}
        {goals.length > 0 && (
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={openCreateModal}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        )}

        {/* Create Goal Modal */}
        <CreateGoalModal
          isOpen={showCreateModal}
          onClose={closeCreateModal}
          onCreate={handleCreateGoal}
        />
      </IonContent>
    </IonPage>
  );
};

export default Goals;
