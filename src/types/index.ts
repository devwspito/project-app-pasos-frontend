/**
 * Central export file for all TypeScript types and interfaces.
 * Import types from this file for consistency across the application.
 *
 * @example
 * ```typescript
 * import type { User, Goal, StepRecord } from '@/types';
 * // or
 * import type { User } from '../types';
 * ```
 */

// User types
export type {
  UserId,
  UserStatus,
  MeasurementUnit,
  User,
  UserProfile,
  UserSettings,
  UserCredentials,
  UserRegistration,
  AuthSession,
  PublicUser,
} from './user.types';

// Activity and step tracking types
export type {
  ActivityId,
  ActivityType,
  TimePeriod,
  StepRecord,
  DailyStepSummary,
  WeeklyStats,
  ActivitySession,
  HourlySteps,
  LiveTrackingState,
  StepChartData,
} from './activity.types';

// Goal types
export type {
  GoalId,
  ChallengeId,
  GoalStatus,
  GoalType,
  ChallengeType,
  Goal,
  CreateGoalInput,
  UpdateGoalInput,
  Streak,
  Challenge,
  ChallengeParticipant,
  ChallengeDetails,
  Achievement,
  GoalSummary,
} from './goal.types';

// Social types
export type {
  FriendshipId,
  FriendshipStatus,
  LeaderboardPeriod,
  FriendRequestDirection,
  Friendship,
  Friend,
  FriendRequest,
  LeaderboardEntry,
  Leaderboard,
  FeedItemType,
  FeedItem,
  FeedComment,
  FriendsSummary,
  FriendComparison,
  UserSearchResult,
} from './social.types';

// API types
export type {
  ApiResponse,
  ApiError,
  PaginationParams,
  PaginatedResponse,
  DateRangeFilter,
  RequestStatus,
  AsyncState,
  WebSocketEventType,
  WebSocketMessage,
  StepUpdatePayload,
  NotificationType,
  Notification,
  BatchResult,
  HealthCheckResponse,
} from './api.types';

// Common utility types
export type {
  EntityId,
  Nullable,
  Optional,
  DeepPartial,
  RequireKeys,
  OptionalKeys,
  ArrayElement,
  LoadingState,
  BaseComponentProps,
  ListProps,
  FieldState,
  FormState,
  SelectOption,
  TabConfig,
  RouteConfig,
  Coordinate,
  TimeRange,
  ChartColorScheme,
  ToastConfig,
  ModalConfig,
  EnvironmentConfig,
} from './common.types';
