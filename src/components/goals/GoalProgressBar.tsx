/**
 * GoalProgressBar - Animated progress bar for goal tracking
 * Displays progress percentage with smooth animations and status colors.
 */

import { IonProgressBar, IonText } from '@ionic/react';
import type { GoalStatus } from '../../types/goal.types';

/**
 * Props for GoalProgressBar component
 */
export interface GoalProgressBarProps {
  /** Progress percentage (0-100) */
  progress: number;
  /** Goal status for color styling */
  status?: GoalStatus;
  /** Whether to show percentage label */
  showLabel?: boolean;
  /** Custom height in pixels */
  height?: number;
  /** Whether to animate the progress bar */
  animated?: boolean;
}

/**
 * Map goal status to Ionic color
 */
const statusColorMap: Record<GoalStatus, string> = {
  active: 'primary',
  completed: 'success',
  failed: 'danger',
  paused: 'warning',
  cancelled: 'medium',
};

/**
 * GoalProgressBar component
 * Displays an animated progress bar with status-based colors
 */
export function GoalProgressBar({
  progress,
  status = 'active',
  showLabel = true,
  height = 8,
  animated = true,
}: GoalProgressBarProps) {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const progressValue = clampedProgress / 100;
  const color = statusColorMap[status];

  return (
    <div className="goal-progress-bar" style={{ width: '100%' }}>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px',
          }}
        >
          <IonText color="medium" style={{ fontSize: '0.85rem' }}>
            Progress
          </IonText>
          <IonText
            color={clampedProgress >= 100 ? 'success' : 'dark'}
            style={{ fontSize: '0.85rem', fontWeight: 600 }}
          >
            {clampedProgress.toFixed(0)}%
          </IonText>
        </div>
      )}
      <div
        style={{
          borderRadius: `${height / 2}px`,
          overflow: 'hidden',
          backgroundColor: 'var(--ion-color-light)',
        }}
      >
        <IonProgressBar
          value={progressValue}
          color={color}
          style={{
            height: `${height}px`,
            transition: animated ? 'transform 0.5s ease-in-out' : 'none',
          }}
        />
      </div>
      {status === 'completed' && (
        <IonText color="success" style={{ fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
          Goal achieved!
        </IonText>
      )}
      {status === 'paused' && (
        <IonText color="warning" style={{ fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
          Goal paused
        </IonText>
      )}
    </div>
  );
}

export default GoalProgressBar;
