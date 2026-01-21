/**
 * Step entity type definitions
 * Matches backend Step model (camelCase field names)
 */

/**
 * Source of step data
 */
export type StepSource = 'manual' | 'native';

/**
 * Hourly step breakdown - maps hour (0-23) to step count
 */
export type HourlySteps = Record<string, number>;

/**
 * Step interface representing daily step data for a user
 */
export interface Step {
  /** Unique identifier (MongoDB ObjectId as string) */
  id: string;
  /** User ID this step data belongs to */
  userId: string;
  /** Date of the step data (ISO date string, YYYY-MM-DD format) */
  date: string;
  /** Total step count for the day */
  stepCount: number;
  /** Source of the step data */
  source: StepSource;
  /** Optional hourly breakdown of steps */
  hourlySteps?: HourlySteps;
  /** Timestamp when the record was created */
  createdAt: string;
}

/**
 * Step creation payload (without server-generated fields)
 */
export interface CreateStepPayload {
  /** Date of the step data (YYYY-MM-DD format) */
  date: string;
  /** Total step count */
  stepCount: number;
  /** Source of the data */
  source: StepSource;
  /** Optional hourly breakdown */
  hourlySteps?: HourlySteps;
}

/**
 * Step update payload
 */
export interface UpdateStepPayload {
  /** Updated step count */
  stepCount?: number;
  /** Updated hourly breakdown */
  hourlySteps?: HourlySteps;
}

/**
 * Step summary for dashboard display
 */
export interface StepSummary {
  /** Total steps for a period */
  totalSteps: number;
  /** Average daily steps */
  averageSteps: number;
  /** Best day step count */
  bestDay: number;
  /** Number of days with data */
  daysWithData: number;
}

/**
 * Step data point for charts
 */
export interface StepDataPoint {
  /** Date label */
  date: string;
  /** Step count */
  steps: number;
}
