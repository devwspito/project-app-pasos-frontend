/**
 * GoalProgressBar - Animated progress bar for displaying goal progress.
 * Shows percentage completion with visual feedback and optional label.
 */

import React, { useEffect, useState, useRef } from 'react';
import { IonText } from '@ionic/react';
import type { GoalStatus, GoalType } from '../../types/goal.types';

/**
 * Props for GoalProgressBar component
 */
export interface GoalProgressBarProps {
  /** Current progress percentage (0-100+) */
  progress: number;
  /** Current value achieved */
  currentValue: number;
  /** Target value to achieve */
  targetValue: number;
  /** Type of goal for display formatting */
  goalType: GoalType;
  /** Goal status for visual styling */
  status: GoalStatus;
  /** Whether to show the label with values */
  showLabel?: boolean;
  /** Whether to animate the progress bar */
  animated?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Custom height for the progress bar */
  height?: number;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Get color based on progress and status
 */
function getProgressColor(progress: number, status: GoalStatus): string {
  if (status === 'completed') return 'var(--ion-color-success)';
  if (status === 'failed') return 'var(--ion-color-danger)';
  if (status === 'paused') return 'var(--ion-color-medium)';
  if (status === 'cancelled') return 'var(--ion-color-medium)';

  // Active goal - color based on progress
  if (progress >= 100) return 'var(--ion-color-success)';
  if (progress >= 75) return 'var(--ion-color-success-shade)';
  if (progress >= 50) return 'var(--ion-color-warning)';
  if (progress >= 25) return 'var(--ion-color-warning-shade)';
  return 'var(--ion-color-primary)';
}

/**
 * Format value based on goal type
 */
function formatValue(value: number, type: GoalType): string {
  switch (type) {
    case 'steps':
      return value.toLocaleString();
    case 'distance':
      // Distance in meters, display in km if >= 1000
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)} km`;
      }
      return `${value} m`;
    case 'calories':
      return `${value.toLocaleString()} cal`;
    case 'active_minutes':
      if (value >= 60) {
        const hours = Math.floor(value / 60);
        const mins = value % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
      }
      return `${value} min`;
    case 'streak':
      return `${value} days`;
    default:
      return value.toLocaleString();
  }
}

/**
 * GoalProgressBar component with animation support
 */
export const GoalProgressBar: React.FC<GoalProgressBarProps> = ({
  progress,
  currentValue,
  targetValue,
  goalType,
  status,
  showLabel = true,
  animated = true,
  animationDuration = 1000,
  height = 12,
  className = '',
}) => {
  const [displayProgress, setDisplayProgress] = useState(animated ? 0 : progress);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const displayProgressRef = useRef<number>(displayProgress);

  // Keep the ref in sync with state
  displayProgressRef.current = displayProgress;

  // Clamp progress between 0 and 100 for display (can be > 100 for overachievement)
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  useEffect(() => {
    if (!animated) {
      setDisplayProgress(clampedProgress);
      return;
    }

    // Use ref to get current display progress without causing re-renders
    const startProgress = displayProgressRef.current;
    const endProgress = clampedProgress;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progressRatio = Math.min(elapsed / animationDuration, 1);

      // Ease-out animation
      const easeOut = 1 - Math.pow(1 - progressRatio, 3);
      const currentProgress = startProgress + (endProgress - startProgress) * easeOut;

      setDisplayProgress(currentProgress);

      if (progressRatio < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    startTimeRef.current = null;
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animated, animationDuration, clampedProgress]);

  const progressColor = getProgressColor(progress, status);
  const isOverachieved = progress > 100;

  return (
    <div className={`goal-progress-bar ${className}`.trim()}>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '4px',
          }}
        >
          <IonText color={status === 'active' ? 'dark' : 'medium'}>
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
              {formatValue(currentValue, goalType)}
            </span>
          </IonText>
          <IonText color="medium">
            <span style={{ fontSize: '0.9rem' }}>
              {formatValue(targetValue, goalType)}
            </span>
          </IonText>
        </div>
      )}

      {/* Progress bar container */}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: 'var(--ion-color-light-shade)',
          borderRadius: `${height / 2}px`,
          overflow: 'hidden',
          position: 'relative',
        }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Goal progress: ${Math.round(progress)}%`}
      >
        {/* Progress fill */}
        <div
          style={{
            width: `${displayProgress}%`,
            height: '100%',
            backgroundColor: progressColor,
            borderRadius: `${height / 2}px`,
            transition: animated ? 'none' : 'width 0.3s ease',
            position: 'relative',
          }}
        >
          {/* Shine effect for completed goals */}
          {isOverachieved && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                animation: 'shimmer 2s infinite',
              }}
            />
          )}
        </div>
      </div>

      {/* Percentage display */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '4px',
        }}
      >
        <IonText color={progress >= 100 ? 'success' : 'medium'}>
          <span style={{ fontSize: '0.8rem', fontWeight: progress >= 100 ? 600 : 400 }}>
            {Math.round(progress)}%
            {isOverachieved && ' - Exceeded!'}
          </span>
        </IonText>
      </div>

      {/* CSS animation for shimmer effect */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default GoalProgressBar;
