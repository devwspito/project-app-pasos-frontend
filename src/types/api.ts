/**
 * API response type definitions
 * Generic wrappers for consistent API communication
 */

/**
 * Successful API response wrapper
 * @template T - The type of data returned
 */
export interface ApiResponse<T> {
  /** Indicates successful operation */
  success: true;
  /** The response data */
  data: T;
  /** Optional success message */
  message?: string;
}

/**
 * Error API response
 */
export interface ApiError {
  /** Indicates failed operation */
  success: false;
  /** Error message describing what went wrong */
  error: string;
  /** HTTP status code */
  statusCode: number;
  /** Optional error code for programmatic handling */
  code?: string;
  /** Optional field-level validation errors */
  validationErrors?: Record<string, string>;
}

/**
 * Union type for any API response
 * @template T - The type of data in successful response
 */
export type ApiResult<T> = ApiResponse<T> | ApiError;

/**
 * Paginated API response wrapper
 * @template T - The type of items in the list
 */
export interface PaginatedResponse<T> {
  /** Indicates successful operation */
  success: true;
  /** The paginated data */
  data: {
    /** List of items */
    items: T[];
    /** Total number of items across all pages */
    total: number;
    /** Current page number (1-indexed) */
    page: number;
    /** Number of items per page */
    limit: number;
    /** Total number of pages */
    totalPages: number;
    /** Whether there are more pages */
    hasMore: boolean;
  };
  /** Optional message */
  message?: string;
}

/**
 * Pagination request parameters
 */
export interface PaginationParams {
  /** Page number (1-indexed) */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Authentication response
 */
export interface AuthResponse {
  /** Indicates successful operation */
  success: true;
  /** Response data */
  data: {
    /** JWT access token */
    token: string;
    /** Token expiration time in seconds */
    expiresIn: number;
    /** User information */
    user: {
      id: string;
      username: string;
      email: string;
    };
  };
  /** Optional message */
  message?: string;
}

/**
 * Login credentials payload
 */
export interface LoginPayload {
  /** Username or email */
  email: string;
  /** User password */
  password: string;
}

/**
 * Registration payload
 */
export interface RegisterPayload {
  /** Desired username */
  username: string;
  /** Email address */
  email: string;
  /** Password */
  password: string;
}

/**
 * Type guard to check if response is an error
 */
export function isApiError(response: ApiResult<unknown>): response is ApiError {
  return response.success === false;
}

/**
 * Type guard to check if response is successful
 */
export function isApiSuccess<T>(response: ApiResult<T>): response is ApiResponse<T> {
  return response.success === true;
}
