/**
 * Goals page for displaying and managing group goals.
 * Features goal list, empty state, and create modal.
 */

import React, { useState, useCallback } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  RefresherEventDetail,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { add, flagOutline } from 'ionicons/icons';
import { useGoals } from '../hooks/useGoals';
import { GoalCard, CreateGoalModal } from '../components/goals';
import { EmptyState } from '../components/common/EmptyState';
import type { GroupGoal, CreateGroupGoalPayload } from '../types/goal';

/**
 * Main page for managing group goals
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
  const handleRefresh = useCallback(async (event: CustomEvent<RefresherEventDetail>) => {
    await refetch();
    event.detail.complete();
  }, [refetch]);

  /**
   * Handle goal click - navigate to detail page
   */
  const handleGoalClick = useCallback((goal: GroupGoal) => {
    history.push(`/goals/${goal.id}`);
  }, [history]);

  /**
   * Open create goal modal
   */
  const handleOpenCreateModal = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  /**
   * Close create goal modal
   */
  const handleCloseCreateModal = useCallback(() => {
    setShowCreateModal(false);
  }, []);

  /**
   * Handle goal creation
   */
  const handleCreateGoal = useCallback(async (payload: CreateGroupGoalPayload): Promise<boolean> => {
    const goal = await createGoal(payload);
    return goal !== null;
  }, [createGoal]);

  const hasGoals = goals.length > 0;
  const showLoading = loading && !hasGoals;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Goals</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* Loading State */}
        {showLoading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
          }}>
            <IonSpinner />
          </div>
        )}

        {/* Error State */}
        {error && !showLoading && (
          <div style={{ padding: '1rem' }}>
            <EmptyState
              icon={flagOutline}
              title="Unable to load goals"
              description={error}
              actionLabel="Try Again"
              onAction={refetch}
            />
          </div>
        )}

        {/* Empty State */}
        {!showLoading && !error && !hasGoals && (
          <div style={{ padding: '1rem' }}>
            <EmptyState
              icon={flagOutline}
              title="No goals yet"
              description="Set your first group goal to start tracking progress with friends!"
              actionLabel="Create Goal"
              onAction={handleOpenCreateModal}
            />
          </div>
        )}

        {/* Goals List */}
        {!showLoading && hasGoals && (
          <div style={{ padding: '0.5rem' }}>
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onClick={handleGoalClick}
              />
            ))}
          </div>
        )}

        {/* Floating Action Button */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={handleOpenCreateModal}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/* Create Goal Modal */}
        <CreateGoalModal
          isOpen={showCreateModal}
          onClose={handleCloseCreateModal}
          onCreate={handleCreateGoal}
        />
      </IonContent>
    </IonPage>
  );
};

export default Goals;
