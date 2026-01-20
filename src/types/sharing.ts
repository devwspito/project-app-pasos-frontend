/**
 * Sharing relationship entity type definitions
 * Matches backend SharingRelationship model (camelCase field names)
 */

/**
 * Status of a sharing relationship
 */
export type SharingStatus = 'pending' | 'accepted' | 'rejected';

/**
 * SharingRelationship interface representing a connection between users
 * Allows users to share their step data with each other
 */
export interface SharingRelationship {
  /** Unique identifier (MongoDB ObjectId as string) */
  id: string;
  /** User ID of the person who sent the request */
  requesterId: string;
  /** User ID of the person receiving the request */
  targetId: string;
  /** Current status of the relationship */
  status: SharingStatus;
  /** Timestamp when the relationship was created */
  createdAt: string;
}

/**
 * Extended sharing relationship with user details
 */
export interface SharingRelationshipWithUsers extends SharingRelationship {
  /** Requester user details */
  requester?: {
    id: string;
    username: string;
  };
  /** Target user details */
  target?: {
    id: string;
    username: string;
  };
}

/**
 * Friend display model for UI
 */
export interface Friend {
  /** User ID of the friend */
  userId: string;
  /** Friend's username */
  username: string;
  /** Sharing relationship ID */
  relationshipId: string;
  /** Friend's recent step count (optional) */
  recentSteps?: number;
  /** Friend's streak (optional) */
  streak?: number;
}

/**
 * Sharing request payload
 */
export interface CreateSharingRequestPayload {
  /** Username or user ID of the target user */
  targetUsername?: string;
  targetId?: string;
}

/**
 * Update sharing status payload
 */
export interface UpdateSharingStatusPayload {
  /** New status for the relationship */
  status: SharingStatus;
}

/**
 * Incoming sharing request for the current user
 */
export interface IncomingSharingRequest {
  /** Relationship ID */
  id: string;
  /** Requester details */
  requester: {
    id: string;
    username: string;
  };
  /** When the request was sent */
  createdAt: string;
}

/**
 * Outgoing sharing request from the current user
 */
export interface OutgoingSharingRequest {
  /** Relationship ID */
  id: string;
  /** Target user details */
  target: {
    id: string;
    username: string;
  };
  /** Current status */
  status: SharingStatus;
  /** When the request was sent */
  createdAt: string;
}
