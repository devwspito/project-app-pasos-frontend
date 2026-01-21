/**
 * Common utility TypeScript types for the Pasos app.
 * Defines reusable generic types and utility types.
 */

import type { ReactNode } from 'react';

/**
 * Generic ID type for entity identifiers
 */
export type EntityId = string;

/**
 * Nullable type helper
 */
export type Nullable<T> = T | null;

/**
 * Optional type helper (can be undefined)
 */
export type Optional<T> = T | undefined;

/**
 * Make all properties of T optional and nullable
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make specific keys required
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific keys optional
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Extract the type of array elements
 */
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

/**
 * Loading state for components
 */
export type LoadingState = 'idle' | 'loading' | 'refreshing' | 'loaded' | 'error';

/**
 * Base props for components that need children
 */
export interface BaseComponentProps {
  /** Component children */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Props for list components
 */
export interface ListProps<T> extends BaseComponentProps {
  /** Items to display */
  items: T[];
  /** Empty state message */
  emptyMessage?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string | null;
  /** Callback when item is clicked */
  onItemClick?: (item: T) => void;
}

/**
 * Form field state
 */
export interface FieldState<T> {
  /** Current value */
  value: T;
  /** Error message */
  error: string | null;
  /** Whether field has been touched */
  touched: boolean;
  /** Whether field is currently validating */
  validating: boolean;
}

/**
 * Generic form state
 */
export interface FormState<T> {
  /** Form values */
  values: T;
  /** Field errors */
  errors: Partial<Record<keyof T, string>>;
  /** Touched fields */
  touched: Partial<Record<keyof T, boolean>>;
  /** Whether form is submitting */
  isSubmitting: boolean;
  /** Whether form is valid */
  isValid: boolean;
  /** Whether form has been modified */
  isDirty: boolean;
}

/**
 * Select/dropdown option
 */
export interface SelectOption<T = string> {
  /** Display label */
  label: string;
  /** Option value */
  value: T;
  /** Whether option is disabled */
  disabled?: boolean;
  /** Optional icon */
  icon?: string;
}

/**
 * Tab configuration
 */
export interface TabConfig {
  /** Tab identifier */
  id: string;
  /** Tab label */
  label: string;
  /** Tab icon name */
  icon?: string;
  /** Route path */
  path: string;
  /** Whether tab is disabled */
  disabled?: boolean;
  /** Badge count */
  badge?: number;
}

/**
 * Navigation route configuration
 */
export interface RouteConfig {
  /** Route path */
  path: string;
  /** Whether route requires authentication */
  requiresAuth: boolean;
  /** Page title */
  title: string;
  /** Component to render */
  component: React.ComponentType;
}

/**
 * Coordinate point
 */
export interface Coordinate {
  latitude: number;
  longitude: number;
}

/**
 * Time range
 */
export interface TimeRange {
  /** Start time (ISO 8601 timestamp) */
  start: string;
  /** End time (ISO 8601 timestamp) */
  end: string;
}

/**
 * Color scheme for charts
 */
export interface ChartColorScheme {
  /** Primary color */
  primary: string;
  /** Secondary color */
  secondary: string;
  /** Success color */
  success: string;
  /** Warning color */
  warning: string;
  /** Danger/error color */
  danger: string;
  /** Background color */
  background: string;
  /** Text color */
  text: string;
}

/**
 * Toast/alert notification config
 */
export interface ToastConfig {
  /** Message to display */
  message: string;
  /** Toast type */
  type: 'success' | 'error' | 'warning' | 'info';
  /** Duration in milliseconds */
  duration?: number;
  /** Position on screen */
  position?: 'top' | 'bottom' | 'middle';
  /** Whether toast can be dismissed */
  dismissible?: boolean;
}

/**
 * Modal/dialog configuration
 */
export interface ModalConfig {
  /** Modal title */
  title: string;
  /** Modal content */
  content: ReactNode;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Whether modal is destructive action */
  isDestructive?: boolean;
  /** Callback on confirm */
  onConfirm?: () => void | Promise<void>;
  /** Callback on cancel */
  onCancel?: () => void;
}

/**
 * Environment configuration
 */
export interface EnvironmentConfig {
  /** API base URL */
  apiBaseUrl: string;
  /** WebSocket URL */
  wsUrl: string;
  /** Environment name */
  environment: 'development' | 'staging' | 'production';
  /** Enable debug features */
  debug: boolean;
  /** App version */
  version: string;
}
