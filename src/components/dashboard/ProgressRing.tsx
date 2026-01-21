import React from 'react';
import './ProgressRing.css';

/**
 * Props for ProgressRing component
 */
export interface ProgressRingProps {
  /** Progress value from 0 to 100 */
  progress: number;
  /** Diameter of the ring in pixels (default: 200) */
  size?: number;
  /** Width of the progress stroke in pixels (default: 12) */
  strokeWidth?: number;
  /** Content to display in the center of the ring */
  children?: React.ReactNode;
}

/**
 * ProgressRing - A circular progress indicator using SVG
 *
 * Displays a circular ring with animated progress fill.
 * Supports customizable size, stroke width, and center content.
 * Uses CSS transitions for smooth animations and Ionic CSS variables for theming.
 *
 * @example
 * ```tsx
 * // Basic usage with percentage display
 * <ProgressRing progress={75}>
 *   <span>75%</span>
 * </ProgressRing>
 *
 * // Custom size and stroke
 * <ProgressRing progress={50} size={150} strokeWidth={8}>
 *   <span>Half way!</span>
 * </ProgressRing>
 *
 * // In a dashboard card
 * <ProgressRing progress={completedSteps / totalSteps * 100}>
 *   <IonText color="primary">{completedSteps}/{totalSteps}</IonText>
 * </ProgressRing>
 * ```
 */
export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 200,
  strokeWidth = 12,
  children,
}) => {
  // Calculate SVG circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Clamp progress to 0-100 range
  const clampedProgress = Math.min(100, Math.max(0, progress));

  // Calculate stroke offset for progress visualization
  // Offset starts at full circumference (0%) and decreases to 0 (100%)
  const offset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div
      className="progress-ring-container"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        width={size}
        height={size}
        className="progress-ring"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          className="progress-ring-bg"
          stroke="var(--ion-color-light)"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className="progress-ring-progress"
          stroke="var(--ion-color-primary)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
      <div className="progress-ring-content">{children}</div>
    </div>
  );
};
