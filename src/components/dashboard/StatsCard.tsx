import { IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonIcon, IonText, IonSkeletonText } from '@ionic/react';
import { footstepsOutline, trendingUpOutline, calendarOutline, flameOutline } from 'ionicons/icons';
import './StatsCard.css';

/**
 * Statistics result from API
 */
export interface StatsResult {
  today: number;
  week: number;
  month: number;
  allTime: number;
}

/**
 * Props for StatsCard component
 */
export interface StatsCardProps {
  /** Statistics data to display */
  stats: StatsResult | null;
  /** Loading state to show skeleton */
  loading?: boolean;
}

/**
 * Props for individual stat item
 */
interface StatItemProps {
  icon: string;
  label: string;
  value: number;
  color: string;
}

/**
 * StatItem - Individual stat display with icon, value, and label
 */
function StatItem({ icon, label, value, color }: StatItemProps) {
  return (
    <IonCard className="stat-item">
      <IonCardContent>
        <IonIcon icon={icon} style={{ color }} className="stat-icon" />
        <IonText color="dark" className="stat-value">
          <h2>{value.toLocaleString()}</h2>
        </IonText>
        <IonText color="medium" className="stat-label">
          <p>{label}</p>
        </IonText>
      </IonCardContent>
    </IonCard>
  );
}

/**
 * StatItemSkeleton - Loading skeleton for stat item
 */
function StatItemSkeleton() {
  return (
    <IonCard className="stat-item">
      <IonCardContent>
        <IonSkeletonText animated style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
        <IonSkeletonText animated style={{ width: '80px', height: '24px', marginTop: '8px' }} />
        <IonSkeletonText animated style={{ width: '60px', height: '16px', marginTop: '4px' }} />
      </IonCardContent>
    </IonCard>
  );
}

/**
 * StatsCard - Display statistics in a 2x2 grid layout
 *
 * Shows total steps (all time), weekly steps, monthly steps, and today's steps.
 * Includes skeleton loading state for better UX.
 *
 * @example
 * ```tsx
 * const stats = { today: 5432, week: 32450, month: 145000, allTime: 1250000 };
 * <StatsCard stats={stats} loading={false} />
 * ```
 */
export function StatsCard({ stats, loading = false }: StatsCardProps) {
  if (loading || !stats) {
    return (
      <IonGrid className="stats-grid">
        <IonRow>
          <IonCol size="6"><StatItemSkeleton /></IonCol>
          <IonCol size="6"><StatItemSkeleton /></IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="6"><StatItemSkeleton /></IonCol>
          <IonCol size="6"><StatItemSkeleton /></IonCol>
        </IonRow>
      </IonGrid>
    );
  }

  return (
    <IonGrid className="stats-grid">
      <IonRow>
        <IonCol size="6">
          <StatItem
            icon={footstepsOutline}
            label="All Time"
            value={stats.allTime}
            color="var(--ion-color-primary)"
          />
        </IonCol>
        <IonCol size="6">
          <StatItem
            icon={trendingUpOutline}
            label="This Week"
            value={stats.week}
            color="var(--ion-color-success)"
          />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="6">
          <StatItem
            icon={calendarOutline}
            label="This Month"
            value={stats.month}
            color="var(--ion-color-tertiary)"
          />
        </IonCol>
        <IonCol size="6">
          <StatItem
            icon={flameOutline}
            label="Today"
            value={stats.today}
            color="var(--ion-color-warning)"
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
