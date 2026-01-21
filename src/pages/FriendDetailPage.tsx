import { useState, useEffect, useCallback } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { alertCircleOutline, personOutline } from 'ionicons/icons';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { FriendStatsView } from '@/components/sharing';
import { sharingService, type FriendStatsData } from '@/services/sharingService';

/**
 * Route params for FriendDetailPage
 */
interface FriendDetailParams {
  friendId: string;
}

/**
 * FriendDetailPage - Displays a friend's step statistics
 *
 * Fetches friend stats via sharingService and displays them using FriendStatsView.
 * Shows loading state while fetching and error state if the request fails.
 * Uses IonBackButton for navigation back to the friends list.
 *
 * @route /friends/:friendId
 */
const FriendDetailPage: React.FC = () => {
  const { friendId } = useParams<FriendDetailParams>();
  const [friendStats, setFriendStats] = useState<FriendStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFriendStats = useCallback(async () => {
    if (!friendId) {
      setError('Friend ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await sharingService.getFriendStats(friendId);

      if (response.data.success && response.data.data) {
        setFriendStats(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load friend stats');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Failed to fetch friend stats:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [friendId]);

  useEffect(() => {
    fetchFriendStats();
  }, [fetchFriendStats]);

  // Determine page title
  const pageTitle = friendStats?.friendName || 'Friend Stats';

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/friends" text="" />
          </IonButtons>
          <IonTitle>{pageTitle}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loading && (
          <LoadingSpinner size="large" aria-label="Loading friend stats" />
        )}

        {!loading && error && (
          <EmptyState
            icon={alertCircleOutline}
            title="Unable to Load Stats"
            description={error}
            actionLabel="Try Again"
            onAction={fetchFriendStats}
          />
        )}

        {!loading && !error && friendStats && (
          <FriendStatsView
            friendName={friendStats.friendName}
            todaySteps={friendStats.todaySteps}
            weeklyTrend={friendStats.weeklyTrend}
            stats={friendStats.stats}
            dailyGoal={friendStats.dailyGoal}
          />
        )}

        {!loading && !error && !friendStats && (
          <EmptyState
            icon={personOutline}
            title="No Data Available"
            description="Friend stats are not available at this time."
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default FriendDetailPage;
