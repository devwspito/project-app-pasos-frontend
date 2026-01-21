/**
 * API-related TypeScript types for the Pasos app.
 * Defines request/response structures, pagination, and error handling.
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  /** Whether the request was successful */
  success: boolean;
  /** Response data (if successful) */
  data: T;
  /** Optional message */
  message?: string;
  /** Response timestamp */
  timestamp: string;
}

/**
 * API error response
 */
export interface ApiError {
  /** Whether the request was successful (always false for errors) */
  success: false;
  /** Error code */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Additional error details */
  details?: Record<string, unknown>;
  /** Error timestamp */
  timestamp: string;
}

/**
 * Pagination parameters for list requests
 */
export interface PaginationParams {
  /** Page number (1-indexed) */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  /** List of items */
  items: T[];
  /** Pagination metadata */
  pagination: {
    /** Current page number */
    currentPage: number;
    /** Items per page */
    pageSize: number;
    /** Total number of items */
    totalItems: number;
    /** Total number of pages */
    totalPages: number;
    /** Whether there are more pages */
    hasNextPage: boolean;
    /** Whether there is a previous page */
    hasPreviousPage: boolean;
  };
}

/**
 * Date range filter
 */
export interface DateRangeFilter {
  /** Start date (ISO 8601 format) */
  startDate: string;
  /** End date (ISO 8601 format) */
  endDate: string;
}

/**
 * API request status
 */
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Generic async state for API calls
 */
export interface AsyncState<T> {
  /** Current data */
  data: T | null;
  /** Request status */
  status: RequestStatus;
  /** Error message (if error) */
  error: string | null;
  /** Last successful fetch timestamp */
  lastFetched: string | null;
}

/**
 * WebSocket event types
 */
export type WebSocketEventType =
  | 'step_update'
  | 'goal_progress'
  | 'friend_activity'
  | 'challenge_update'
  | 'achievement_earned'
  | 'notification';

/**
 * WebSocket message structure
 */
export interface WebSocketMessage<T = unknown> {
  /** Event type */
  type: WebSocketEventType;
  /** Event payload */
  payload: T;
  /** Event timestamp */
  timestamp: string;
}

/**
 * Step update WebSocket payload
 */
export interface StepUpdatePayload {
  /** New step count */
  steps: number;
  /** Source of the update */
  source: string;
  /** User ID (for friend updates) */
  userId?: string;
}

/**
 * Notification types
 */
export type NotificationType =
  | 'goal_achieved'
  | 'streak_at_risk'
  | 'friend_request'
  | 'challenge_invite'
  | 'challenge_ending'
  | 'achievement'
  | 'system';

/**
 * In-app notification
 */
export interface Notification {
  /** Unique notification ID */
  id: string;
  /** Notification type */
  type: NotificationType;
  /** Notification title */
  title: string;
  /** Notification body */
  body: string;
  /** Whether the notification has been read */
  isRead: boolean;
  /** Related entity ID (e.g., challenge ID, friend ID) */
  relatedId?: string;
  /** Deep link path */
  deepLink?: string;
  /** Notification timestamp */
  createdAt: string;
}

/**
 * Batch operation result
 */
export interface BatchResult<T> {
  /** Successfully processed items */
  succeeded: T[];
  /** Failed items with error info */
  failed: Array<{
    item: T;
    error: string;
  }>;
  /** Total processed count */
  totalProcessed: number;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  /** Service status */
  status: 'healthy' | 'degraded' | 'unhealthy';
  /** Service version */
  version: string;
  /** Uptime in seconds */
  uptimeSeconds: number;
  /** Individual service statuses */
  services: Record<string, 'up' | 'down'>;
}
