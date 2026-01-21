import { useMemo } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonText,
} from '@ionic/react';
import {
  footstepsOutline,
  calendarOutline,
  trendingUpOutline,
  ribbonOutline,
} from 'ionicons/icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';
import { ProgressRing } from '@/components/dashboard';
import './FriendStatsView.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Weekly trend data point
 */
export interface WeeklyTrendPoint {
  /** Date in ISO format (YYYY-MM-DD) */
  date: string;
  /** Total steps for that day */
  total: number;
}

/**
 * Stats breakdown
 */
export interface StatsBreakdown {
  /** Total steps today */
  today: number;
  /** Total steps this week */
  week: number;
  /** Total steps this month */
  month: number;
  /** Total steps all time */
  allTime: number;
}

/**
 * Props for FriendStatsView component
 */
export interface FriendStatsViewProps {
  /** Friend's display name */
  friendName: string;
  /** Today's step count */
  todaySteps: number;
  /** Weekly trend data (last 7 days) */
  weeklyTrend: WeeklyTrendPoint[];
  /** Aggregated statistics */
  stats: StatsBreakdown;
  /** Friend's daily step goal (optional) */
  dailyGoal?: number;
}

/**
 * Internal stat item component
 */
interface StatItemProps {
  icon: string;
  label: string;
  value: number;
  color: string;
}

function StatItem({ icon, label, value, color }: StatItemProps) {
  return (
    <div className="stat-item">
      <IonIcon icon={icon} style={{ color }} className="stat-icon" aria-hidden="true" />
      <div className="stat-value">
        <IonText>
          <h3>{value.toLocaleString()}</h3>
        </IonText>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}

/**
 * FriendStatsView - Displays a friend's step statistics
 *
 * Shows today's steps with optional progress ring (if daily goal is set),
 * a weekly bar chart, and stats cards for week, month, and all-time totals.
 * This is a read-only view of friend's data.
 *
 * @example
 * ```tsx
 * <FriendStatsView
 *   friendName="John Doe"
 *   todaySteps={8432}
 *   weeklyTrend={[{ date: '2024-01-15', total: 8500 }, ...]}
 *   stats={{ today: 8432, week: 52000, month: 180000, allTime: 1250000 }}
 *   dailyGoal={10000}
 * />
 * ```
 */
export function FriendStatsView({
  friendName,
  todaySteps,
  weeklyTrend,
  stats,
  dailyGoal,
}: FriendStatsViewProps) {
  // Calculate progress percentage if daily goal is set
  const progressPercent = dailyGoal ? Math.min(100, (todaySteps / dailyGoal) * 100) : 0;
  const hasGoal = dailyGoal !== undefined && dailyGoal > 0;

  // Prepare chart data
  const chartData = useMemo(() => {
    const labels = weeklyTrend.map((item) => {
      try {
        return format(parseISO(item.date), 'EEE');
      } catch {
        return item.date;
      }
    });

    const data = weeklyTrend.map((item) => item.total);

    return {
      labels,
      datasets: [
        {
          label: 'Steps',
          data,
          backgroundColor: 'rgba(var(--ion-color-primary-rgb), 0.7)',
          borderColor: 'var(--ion-color-primary)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }, [weeklyTrend]);

  // Chart options
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
            size: 12,
          },
          bodyFont: {
            size: 14,
          },
          callbacks: {
            label: (context: { formattedValue: string }) => {
              return `${context.formattedValue} steps`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(var(--ion-color-medium-rgb), 0.2)',
          },
          ticks: {
            callback: (value: string | number) => {
              const numValue = typeof value === 'string' ? parseFloat(value) : value;
              if (numValue >= 1000) {
                return `${(numValue / 1000).toFixed(0)}k`;
              }
              return value;
            },
          },
        },
      },
    }),
    []
  );

  return (
    <div className="friend-stats-view">
      {/* Today's Steps Section */}
      <IonCard className="today-steps-card">
        <IonCardContent className="today-steps-content">
          <div className="today-steps-display">
            {hasGoal ? (
              <ProgressRing progress={progressPercent} size={160} strokeWidth={10}>
                <div className="progress-ring-inner">
                  <IonText color="primary">
                    <h2 className="steps-number">{todaySteps.toLocaleString()}</h2>
                  </IonText>
                  <p className="steps-label">steps today</p>
                  <p className="goal-text">of {dailyGoal?.toLocaleString()} goal</p>
                </div>
              </ProgressRing>
            ) : (
              <div className="steps-display-no-goal">
                <IonIcon icon={footstepsOutline} className="steps-icon" aria-hidden="true" />
                <IonText color="primary">
                  <h2 className="steps-number">{todaySteps.toLocaleString()}</h2>
                </IonText>
                <p className="steps-label">steps today</p>
              </div>
            )}
          </div>
          <p className="friend-name-subtitle">{friendName}'s activity</p>
        </IonCardContent>
      </IonCard>

      {/* Weekly Chart Section */}
      <IonCard className="weekly-chart-card">
        <IonCardHeader>
          <IonCardTitle>Weekly Activity</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </IonCardContent>
      </IonCard>

      {/* Stats Grid Section */}
      <IonCard className="stats-card">
        <IonCardHeader>
          <IonCardTitle>Statistics</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid className="stats-grid">
            <IonRow>
              <IonCol size="6">
                <StatItem
                  icon={trendingUpOutline}
                  label="This Week"
                  value={stats.week}
                  color="var(--ion-color-success)"
                />
              </IonCol>
              <IonCol size="6">
                <StatItem
                  icon={calendarOutline}
                  label="This Month"
                  value={stats.month}
                  color="var(--ion-color-tertiary)"
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="6">
                <StatItem
                  icon={footstepsOutline}
                  label="Today"
                  value={stats.today}
                  color="var(--ion-color-warning)"
                />
              </IonCol>
              <IonCol size="6">
                <StatItem
                  icon={ribbonOutline}
                  label="All Time"
                  value={stats.allTime}
                  color="var(--ion-color-primary)"
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>
    </div>
  );
}

export default FriendStatsView;
