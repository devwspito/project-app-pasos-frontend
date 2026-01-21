/**
 * PendingRequests component displays incoming and outgoing friend requests.
 * Allows accepting, rejecting, and cancelling requests.
 */

import React, { useState } from 'react';
import {
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonButton,
  IonIcon,
  IonText,
  IonSpinner,
  IonListHeader,
  IonBadge,
} from '@ionic/react';
import { checkmark, close, time, mail, paperPlane } from 'ionicons/icons';
import type { FriendRequest } from '../../types/social.types';

export interface PendingRequestsProps {
  /** Incoming friend requests */
  incoming: FriendRequest[];
  /** Outgoing friend requests */
  outgoing: FriendRequest[];
  /** Callback to accept a request */
  onAccept: (friendshipId: string) => Promise<boolean>;
  /** Callback to reject a request */
  onReject: (friendshipId: string) => Promise<boolean>;
  /** Callback to cancel an outgoing request */
  onCancel?: (friendshipId: string) => Promise<boolean>;
}

/**
 * Component for displaying and managing pending friend requests
 */
export const PendingRequests: React.FC<PendingRequestsProps> = ({
  incoming,
  outgoing,
  onAccept,
  onReject,
  onCancel,
}) => {
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const handleAccept = async (friendshipId: string) => {
    setProcessingIds((prev) => new Set([...prev, friendshipId]));
    try {
      await onAccept(friendshipId);
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(friendshipId);
        return next;
      });
    }
  };

  const handleReject = async (friendshipId: string) => {
    setProcessingIds((prev) => new Set([...prev, friendshipId]));
    try {
      await onReject(friendshipId);
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(friendshipId);
        return next;
      });
    }
  };

  const handleCancel = async (friendshipId: string) => {
    if (!onCancel) return;
    setProcessingIds((prev) => new Set([...prev, friendshipId]));
    try {
      await onCancel(friendshipId);
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(friendshipId);
        return next;
      });
    }
  };

  const hasRequests = incoming.length > 0 || outgoing.length > 0;

  if (!hasRequests) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1rem',
          textAlign: 'center',
        }}
      >
        <IonIcon
          icon={mail}
          style={{
            fontSize: '4rem',
            color: 'var(--ion-color-medium)',
            marginBottom: '1rem',
          }}
        />
        <IonText color="medium">
          <p>No pending friend requests</p>
        </IonText>
      </div>
    );
  }

  return (
    <>
      {incoming.length > 0 && (
        <IonList>
          <IonListHeader>
            <IonLabel>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IonIcon icon={mail} color="primary" />
                Incoming Requests
                <IonBadge color="primary">{incoming.length}</IonBadge>
              </h2>
            </IonLabel>
          </IonListHeader>

          {incoming.map((request) => (
            <IonItem key={request.id}>
              <IonAvatar slot="start">
                {request.user.avatarUrl ? (
                  <img src={request.user.avatarUrl} alt={request.user.name} />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'var(--ion-color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  >
                    {request.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </IonAvatar>

              <IonLabel>
                <h2>{request.user.name}</h2>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <IonIcon icon={time} />
                  {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </IonLabel>

              {processingIds.has(request.id) ? (
                <IonSpinner slot="end" />
              ) : (
                <>
                  <IonButton
                    slot="end"
                    color="success"
                    size="small"
                    onClick={() => handleAccept(request.id)}
                  >
                    <IonIcon icon={checkmark} slot="icon-only" />
                  </IonButton>
                  <IonButton
                    slot="end"
                    color="danger"
                    size="small"
                    fill="outline"
                    onClick={() => handleReject(request.id)}
                  >
                    <IonIcon icon={close} slot="icon-only" />
                  </IonButton>
                </>
              )}
            </IonItem>
          ))}
        </IonList>
      )}

      {outgoing.length > 0 && (
        <IonList>
          <IonListHeader>
            <IonLabel>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IonIcon icon={paperPlane} color="medium" />
                Sent Requests
                <IonBadge color="medium">{outgoing.length}</IonBadge>
              </h2>
            </IonLabel>
          </IonListHeader>

          {outgoing.map((request) => (
            <IonItem key={request.id}>
              <IonAvatar slot="start">
                {request.user.avatarUrl ? (
                  <img src={request.user.avatarUrl} alt={request.user.name} />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'var(--ion-color-medium)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  >
                    {request.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </IonAvatar>

              <IonLabel>
                <h2>{request.user.name}</h2>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <IonIcon icon={time} />
                  Sent {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </IonLabel>

              {onCancel && (
                processingIds.has(request.id) ? (
                  <IonSpinner slot="end" />
                ) : (
                  <IonButton
                    slot="end"
                    color="medium"
                    size="small"
                    fill="outline"
                    onClick={() => handleCancel(request.id)}
                  >
                    Cancel
                  </IonButton>
                )
              )}
            </IonItem>
          ))}
        </IonList>
      )}
    </>
  );
};
