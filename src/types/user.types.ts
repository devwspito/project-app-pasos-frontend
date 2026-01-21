/**
 * User-related TypeScript types and interfaces for the Pasos app.
 * Defines user profile, settings, and related types.
 */

/**
 * Base user identifier type
 */
export type UserId = string;

/**
 * User account status
 */
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

/**
 * User measurement units preference
 */
export type MeasurementUnit = 'metric' | 'imperial';

/**
 * Base user interface - core user data
 */
export interface User {
  /** Unique user identifier */
  id: UserId;
  /** User's email address */
  email: string;
  /** User's display name */
  name: string;
  /** Optional profile avatar URL */
  avatarUrl?: string;
  /** Account creation timestamp */
  createdAt?: string;
  /** Last profile update timestamp */
  updatedAt?: string;
}

/**
 * Extended user profile with additional fitness-related data
 */
export interface UserProfile extends User {
  /** User's bio/description */
  bio?: string;
  /** User's date of birth (ISO 8601 format) */
  dateOfBirth?: string;
  /** User's height in centimeters */
  heightCm?: number;
  /** User's weight in kilograms */
  weightKg?: number;
  /** Preferred measurement units */
  measurementUnit: MeasurementUnit;
  /** Account status */
  status: UserStatus;
  /** Total lifetime steps */
  totalSteps?: number;
  /** Number of friends */
  friendsCount?: number;
  /** Whether profile is public */
  isPublic: boolean;
}

/**
 * User settings/preferences
 */
export interface UserSettings {
  /** User ID this settings belong to */
  userId: UserId;
  /** Enable push notifications */
  notificationsEnabled: boolean;
  /** Enable daily step reminders */
  dailyRemindersEnabled: boolean;
  /** Reminder time (HH:mm format) */
  reminderTime?: string;
  /** Enable weekly progress reports */
  weeklyReportsEnabled: boolean;
  /** Enable social sharing */
  socialSharingEnabled: boolean;
  /** Preferred language (ISO 639-1 code) */
  language: string;
  /** Timezone (IANA timezone identifier) */
  timezone: string;
  /** Daily step goal */
  dailyStepGoal: number;
}

/**
 * User credentials for authentication
 */
export interface UserCredentials {
  email: string;
  password: string;
}

/**
 * User registration data
 */
export interface UserRegistration extends UserCredentials {
  name: string;
  /** Optional: accept terms of service */
  acceptedTerms?: boolean;
}

/**
 * Authenticated user session
 */
export interface AuthSession {
  /** The authenticated user */
  user: User;
  /** Access token for API requests */
  accessToken: string;
  /** Refresh token for renewing access */
  refreshToken?: string;
  /** Token expiration timestamp (Unix timestamp in seconds) */
  expiresAt: number;
}

/**
 * Public user data visible to other users
 */
export interface PublicUser {
  id: UserId;
  name: string;
  avatarUrl?: string;
  totalSteps?: number;
  /** Number of mutual friends */
  mutualFriendsCount?: number;
}
