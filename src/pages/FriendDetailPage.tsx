/**
 * FriendDetailPage displays detailed information about a specific friend.
 * Shows stats, activity history, and friend actions.
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
  IonAvatar,
  IonSpinner,
  IonText,
  RefresherEventDetail,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { FriendStatsView } from '../components/sharing/FriendStatsView';
import { useSharing } from '../hooks/useSharing';
import type { FriendStatsResponse } from '../services/sharingService';

interface RouteParams {
  friendId: string;
}

/**
 * Page component for viewing a friend's detailed profile and stats
 */
const FriendDetailPage: React.FC = () => {
  const { friendId } = useParams<RouteParams>();
  const { getFriendStats } = useSharing(false);
  const [stats, setStats] = useState<FriendStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch friend stats
   */
  const fetchStats = useCallback(async () => {
    if (!friendId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await getFriendStats(friendId);
      if (result) {
        setStats(result);
      } else {
        setError('Unable to load friend data');
      }
    } catch (err) {
      setError('Failed to load friend data');
      console.error('Error fetching friend stats:', err);
    } finally {
      setLoading(false);
    }
  }, [friendId, getFriendStats]);

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchStats();
    event.detail.complete();
  };

  // Fetch on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const friendName = stats?.friend?.name || 'Friend';

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/friends" />
          </IonButtons>
          <IonTitle>{friendName}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {loading && !stats && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <IonSpinner />
          </div>
        )}

        {error && !stats && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          </div>
        )}

        {stats && (
          <>
            {/* Friend Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <IonAvatar style={{ width: '80px', height: '80px', margin: '0 auto' }}>
                {stats.friend.avatarUrl ? (
                  <img src={stats.friend.avatarUrl} alt={stats.friend.name} />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'var(--ion-color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '2rem',
                    }}
                  >
                    {stats.friend.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </IonAvatar>
              <h1 style={{ margin: '1rem 0 0.5rem' }}>{stats.friend.name}</h1>
              <IonText color="medium">
                <p style={{ margin: 0 }}>
                  {stats.friend.isActive ? 'Active now' : 'Last active recently'}
                </p>
              </IonText>
            </div>

            {/* Stats View */}
            <FriendStatsView stats={stats} loading={loading} />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default FriendDetailPage;
