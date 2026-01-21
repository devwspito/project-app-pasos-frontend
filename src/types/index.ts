/**
 * Barrel file for all TypeScript type definitions
 * Import types from '@/types' for easy access
 */

// User types
export type {
  User,
  CreateUserPayload,
  UpdateUserPayload,
  UserProfile,
} from './user';

// Step types
export type {
  Step,
  StepSource,
  HourlySteps,
  CreateStepPayload,
  UpdateStepPayload,
  StepSummary,
  StepDataPoint,
} from './step';

// Sharing relationship types
export type {
  SharingRelationship,
  SharingRelationshipWithUsers,
  SharingStatus,
  Friend,
  CreateSharingRequestPayload,
  UpdateSharingStatusPayload,
  IncomingSharingRequest,
  OutgoingSharingRequest,
} from './sharing';

// Group goal types
export type {
  GroupGoal,
  GroupGoalMember,
  GroupGoalProgress,
  CreateGroupGoalPayload,
  UpdateGroupGoalPayload,
  GroupGoalInvitation,
  GroupGoalSummary,
} from './goal';

// API types
export type {
  ApiResponse,
  ApiError,
  ApiResult,
  PaginatedResponse,
  PaginationParams,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from './api';

// API type guards (these are values, not types)
export { isApiError, isApiSuccess } from './api';
