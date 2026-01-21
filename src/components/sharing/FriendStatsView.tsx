/**
 * FriendStatsView component displays detailed statistics for a friend.
 * Shows daily steps, streaks, and progress charts.
 */

import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonSkeletonText,
  IonBadge,
  IonText,
} from '@ionic/react';
import { footsteps, flame, trophy, calendar, trendingUp } from 'ionicons/icons';
import type { FriendStatsResponse } from '../../services/sharingService';

export interface FriendStatsViewProps {
  /** Friend stats data */
  stats: FriendStatsResponse | null;
  /** Loading state */
  loading?: boolean;
}

/**
 * Component for displaying detailed friend statistics
 */
export const FriendStatsView: React.FC<FriendStatsViewProps> = ({
  stats,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="friend-stats-loading">
        <IonCard>
          <IonCardHeader>
            <IonSkeletonText animated style={{ width: '60%' }} />
          </IonCardHeader>
          <IonCardContent>
            <IonSkeletonText animated style={{ width: '100%', height: '100px' }} />
          </IonCardContent>
        </IonCard>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <IonText color="medium">
          <p>Unable to load statistics</p>
        </IonText>
      </div>
    );
  }

  const { friend, dailyStats, currentStreak, longestStreak, totalSteps } = stats;

  // Get today's steps from daily stats
  const todayStats = dailyStats && dailyStats.length > 0 ? dailyStats[0] : null;
  const todaySteps = todayStats?.totalSteps || friend.stepsToday || 0;

  return (
    <div className="friend-stats-view">
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        {/* Today's Steps */}
        <IonCard>
          <IonCardContent style={{ textAlign: 'center', padding: '1rem' }}>
            <IonIcon icon={footsteps} color="primary" style={{ fontSize: '2rem' }} />
            <h2 style={{ margin: '0.5rem 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {todaySteps.toLocaleString()}
            </h2>
            <IonText color="medium">
              <small>Today</small>
            </IonText>
          </IonCardContent>
        </IonCard>

        {/* Current Streak */}
        <IonCard>
          <IonCardContent style={{ textAlign: 'center', padding: '1rem' }}>
            <IonIcon icon={flame} color="warning" style={{ fontSize: '2rem' }} />
            <h2 style={{ margin: '0.5rem 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {currentStreak}
            </h2>
            <IonText color="medium">
              <small>Day Streak</small>
            </IonText>
          </IonCardContent>
        </IonCard>

        {/* Total Steps */}
        <IonCard>
          <IonCardContent style={{ textAlign: 'center', padding: '1rem' }}>
            <IonIcon icon={trendingUp} color="success" style={{ fontSize: '2rem' }} />
            <h2 style={{ margin: '0.5rem 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {totalSteps.toLocaleString()}
            </h2>
            <IonText color="medium">
              <small>Total Steps</small>
            </IonText>
          </IonCardContent>
        </IonCard>

        {/* Longest Streak */}
        <IonCard>
          <IonCardContent style={{ textAlign: 'center', padding: '1rem' }}>
            <IonIcon icon={trophy} color="tertiary" style={{ fontSize: '2rem' }} />
            <h2 style={{ margin: '0.5rem 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {longestStreak}
            </h2>
            <IonText color="medium">
              <small>Best Streak</small>
            </IonText>
          </IonCardContent>
        </IonCard>
      </div>

      {/* Recent Activity */}
      {dailyStats && dailyStats.length > 0 && (
        <IonCard>
          <IonCardHeader>
            <IonCardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IonIcon icon={calendar} color="primary" />
              Recent Activity
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {dailyStats.slice(0, 7).map((day, index) => {
                const goalMet = friend.dailyGoal && day.totalSteps >= friend.dailyGoal;
                const progress = friend.dailyGoal && friend.dailyGoal > 0
                  ? Math.min(100, Math.round((day.totalSteps / friend.dailyGoal) * 100))
                  : 0;

                return (
                  <IonItem key={day.date || index} lines="full">
                    <IonLabel>
                      <h3>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</h3>
                      <p>{day.totalSteps.toLocaleString()} steps</p>
                    </IonLabel>
                    {friend.dailyGoal && (
                      <IonBadge slot="end" color={goalMet ? 'success' : 'medium'}>
                        {progress}%
                      </IonBadge>
                    )}
                  </IonItem>
                );
              })}
            </IonList>
          </IonCardContent>
        </IonCard>
      )}

      {/* Goal Progress */}
      {friend.dailyGoal && (
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Daily Goal</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '1.25rem', margin: '0.5rem 0' }}>
                <strong>{todaySteps.toLocaleString()}</strong> / {friend.dailyGoal.toLocaleString()} steps
              </p>
              <div
                style={{
                  height: '8px',
                  background: 'var(--ion-color-light)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginTop: '1rem',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, (todaySteps / friend.dailyGoal) * 100)}%`,
                    background: todaySteps >= friend.dailyGoal
                      ? 'var(--ion-color-success)'
                      : 'var(--ion-color-primary)',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          </IonCardContent>
        </IonCard>
      )}
    </div>
  );
};
