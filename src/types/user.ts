/**
 * User entity type definitions
 * Matches backend User model (camelCase field names)
 */

/**
 * User interface representing an authenticated user in the system
 */
export interface User {
  /** Unique identifier (MongoDB ObjectId as string) */
  id: string;
  /** Unique username for the user */
  username: string;
  /** User's email address */
  email: string;
  /** Timestamp when the user was created */
  createdAt: string;
  /** Timestamp when the user was last updated */
  updatedAt: string;
}

/**
 * User creation payload (without server-generated fields)
 */
export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
}

/**
 * User update payload (partial, all fields optional)
 */
export interface UpdateUserPayload {
  username?: string;
  email?: string;
}

/**
 * User profile with extended information
 */
export interface UserProfile extends User {
  /** Total step count for the user */
  totalSteps?: number;
  /** Number of active sharing relationships */
  friendCount?: number;
  /** Number of group goals the user is part of */
  groupGoalCount?: number;
}
