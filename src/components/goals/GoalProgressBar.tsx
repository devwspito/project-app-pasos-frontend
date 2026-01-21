import { IonBadge } from '@ionic/react';
import './GoalProgressBar.css';

/**
 * Size variants for the GoalProgressBar
 */
export type GoalProgressBarSize = 'small' | 'default' | 'large';

/**
 * Props for GoalProgressBar component
 */
export interface GoalProgressBarProps {
  /** Current number of steps completed */
  currentSteps: number;
  /** Target number of steps for the goal */
  targetSteps: number;
  /** Whether to show the label with step counts (default: true) */
  showLabel?: boolean;
  /** Size of the progress bar - 'small', 'default', or 'large' (default: 'default') */
  size?: GoalProgressBarSize;
}

/**
 * Format a number with locale-specific thousand separators
 */
const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Get the color class based on progress percentage
 * @param percentage - Progress percentage (0-100)
 * @returns CSS class for the color
 */
const getProgressColorClass = (percentage: number): string => {
  if (percentage >= 100) {
    return 'progress-complete';
  }
  if (percentage >= 66) {
    return 'progress-success';
  }
  if (percentage >= 33) {
    return 'progress-warning';
  }
  return 'progress-danger';
};

/**
 * GoalProgressBar - A horizontal progress bar for displaying goal progress
 *
 * Displays a progress bar with animated fill based on current/target steps.
 * Includes color coding for progress levels and optional step count labels.
 * Uses CSS transitions for smooth animations and Ionic CSS variables for theming.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <GoalProgressBar currentSteps={5000} targetSteps={10000} />
 *
 * // Without label
 * <GoalProgressBar currentSteps={7500} targetSteps={10000} showLabel={false} />
 *
 * // Large size
 * <GoalProgressBar currentSteps={10000} targetSteps={10000} size="large" />
 *
 * // In a goal card
 * <GoalProgressBar
 *   currentSteps={goal.currentSteps}
 *   targetSteps={goal.targetSteps}
 *   size="small"
 * />
 * ```
 */
export const GoalProgressBar: React.FC<GoalProgressBarProps> = ({
  currentSteps,
  targetSteps,
  showLabel = true,
  size = 'default',
}) => {
  // Calculate percentage (clamped to 0-100, handle division by zero)
  const percentage = targetSteps > 0
    ? Math.min(100, Math.max(0, (currentSteps / targetSteps) * 100))
    : 0;
  const isComplete = percentage >= 100;
  const colorClass = getProgressColorClass(percentage);

  return (
    <div
      className={`goal-progress-bar goal-progress-bar--${size}`}
      role="progressbar"
      aria-valuenow={Math.round(percentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Goal progress: ${formatNumber(currentSteps)} of ${formatNumber(targetSteps)} steps`}
    >
      {/* Label with step counts */}
      {showLabel && (
        <div className="goal-progress-bar__label">
          <span className="goal-progress-bar__steps">
            {formatNumber(currentSteps)} / {formatNumber(targetSteps)} steps
          </span>
          {isComplete && (
            <IonBadge color="success" className="goal-progress-bar__badge">
              Complete!
            </IonBadge>
          )}
        </div>
      )}

      {/* Progress bar track */}
      <div className="goal-progress-bar__track">
        <div
          className={`goal-progress-bar__fill ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Percentage text for screen readers */}
      <span className="sr-only">{Math.round(percentage)}% complete</span>
    </div>
  );
};
