import { IonSpinner } from '@ionic/react';

/**
 * Size variants for the LoadingSpinner
 */
export type SpinnerSize = 'small' | 'default' | 'large';

/**
 * Props for LoadingSpinner component
 */
export interface LoadingSpinnerProps {
  /** Size of the spinner - 'small' (16px), 'default' (28px), or 'large' (48px) */
  size?: SpinnerSize;
  /** Ionic color name - 'primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'dark', 'medium', 'light' */
  color?: string;
  /** Optional aria-label for accessibility */
  'aria-label'?: string;
}

/**
 * Map spinner size to CSS dimensions
 */
const sizeMap: Record<SpinnerSize, string> = {
  small: '16px',
  default: '28px',
  large: '48px',
};

/**
 * LoadingSpinner - A centered loading indicator
 *
 * Wraps IonSpinner with a centered container and configurable size/color.
 * Uses Ionic's built-in spinner component for consistent animations.
 *
 * @example
 * ```tsx
 * // Default spinner
 * <LoadingSpinner />
 *
 * // Large primary spinner
 * <LoadingSpinner size="large" color="primary" />
 *
 * // Small secondary spinner with custom label
 * <LoadingSpinner size="small" color="secondary" aria-label="Loading data" />
 * ```
 */
export function LoadingSpinner({
  size = 'default',
  color = 'primary',
  'aria-label': ariaLabel = 'Loading',
}: LoadingSpinnerProps) {
  const dimension = sizeMap[size];

  return (
    <div
      className="loading-spinner-container flex items-center justify-center"
      role="status"
      aria-busy="true"
      aria-label={ariaLabel}
    >
      <IonSpinner
        name="crescent"
        color={color}
        style={{ width: dimension, height: dimension }}
      />
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}
