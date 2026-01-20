/**
 * Group goal entity type definitions
 * Matches backend GroupGoal model (camelCase field names)
 */

/**
 * Member contribution in a group goal
 */
export interface GroupGoalMember {
  /** User ID of the member */
  userId: string;
  /** Member's username */
  username: string;
  /** Member's step contribution to the goal */
  contribution: number;
}

/**
 * Progress information for a group goal
 */
export interface GroupGoalProgress {
  /** Current total steps contributed */
  currentSteps: number;
  /** Target step count */
  targetSteps: number;
  /** Progress percentage (0-100) */
  percentage: number;
  /** Whether the goal has been achieved */
  isComplete: boolean;
}

/**
 * GroupGoal interface representing a shared fitness goal
 */
export interface GroupGoal {
  /** Unique identifier (MongoDB ObjectId as string) */
  id: string;
  /** Name of the group goal */
  name: string;
  /** Optional description of the goal */
  description?: string;
  /** Target step count to achieve */
  targetSteps: number;
  /** Start date of the goal (ISO date string) */
  startDate: string;
  /** End date of the goal (ISO date string) */
  endDate: string;
  /** User ID of the goal creator/owner */
  ownerId: string;
  /** Optional list of members with their contributions */
  members?: GroupGoalMember[];
  /** Optional progress information */
  progress?: GroupGoalProgress;
  /** Timestamp when the goal was created */
  createdAt?: string;
  /** Timestamp when the goal was last updated */
  updatedAt?: string;
}

/**
 * Group goal creation payload
 */
export interface CreateGroupGoalPayload {
  /** Name of the goal */
  name: string;
  /** Optional description */
  description?: string;
  /** Target step count */
  targetSteps: number;
  /** Start date (YYYY-MM-DD) */
  startDate: string;
  /** End date (YYYY-MM-DD) */
  endDate: string;
  /** Optional initial member IDs to invite */
  memberIds?: string[];
}

/**
 * Group goal update payload
 */
export interface UpdateGroupGoalPayload {
  /** Updated name */
  name?: string;
  /** Updated description */
  description?: string;
  /** Updated target */
  targetSteps?: number;
  /** Updated end date */
  endDate?: string;
}

/**
 * Group goal invitation
 */
export interface GroupGoalInvitation {
  /** Invitation ID */
  id: string;
  /** Goal details */
  goal: {
    id: string;
    name: string;
    description?: string;
    targetSteps: number;
    startDate: string;
    endDate: string;
  };
  /** Inviter details */
  invitedBy: {
    id: string;
    username: string;
  };
  /** When the invitation was sent */
  createdAt: string;
}

/**
 * Group goal summary for list display
 */
export interface GroupGoalSummary {
  /** Goal ID */
  id: string;
  /** Goal name */
  name: string;
  /** Number of members */
  memberCount: number;
  /** Progress percentage */
  progressPercentage: number;
  /** Days remaining */
  daysRemaining: number;
  /** Whether the goal is complete */
  isComplete: boolean;
}
