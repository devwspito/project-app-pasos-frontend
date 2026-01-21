/**
 * FriendsPage is the main page for managing friends and requests.
 * Features tabs for friends list and pending requests, plus add friend modal.
 */

import React, { useState, useCallback } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonFab,
  IonFabButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonBadge,
  IonSpinner,
  RefresherEventDetail,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { personAdd } from 'ionicons/icons';
import { FriendsList } from '../components/sharing/FriendsList';
import { PendingRequests } from '../components/sharing/PendingRequests';
import { AddFriendModal } from '../components/sharing/AddFriendModal';
import { useSharing } from '../hooks/useSharing';
import type { Friend } from '../types/social.types';

type TabType = 'friends' | 'pending';

/**
 * Main page for friend management with tabbed interface
 */
const FriendsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('friends');
  const [showAddModal, setShowAddModal] = useState(false);
  const history = useHistory();

  const {
    friends,
    pendingIncoming,
    pendingOutgoing,
    loading,
    refetch,
    sendRequest,
    acceptRequest,
    rejectRequest,
    revokeAccess,
    searchUsers,
  } = useSharing();

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = useCallback(async (event: CustomEvent<RefresherEventDetail>) => {
    await refetch();
    event.detail.complete();
  }, [refetch]);

  /**
   * Handle friend click - navigate to detail page
   */
  const handleFriendClick = useCallback((friend: Friend) => {
    history.push(`/friends/${friend.id}`);
  }, [history]);

  /**
   * Handle tab change
   */
  const handleTabChange = useCallback((e: CustomEvent) => {
    setActiveTab(e.detail.value as TabType);
  }, []);

  /**
   * Open add friend modal
   */
  const handleOpenAddModal = useCallback(() => {
    setShowAddModal(true);
  }, []);

  /**
   * Close add friend modal
   */
  const handleCloseAddModal = useCallback(() => {
    setShowAddModal(false);
  }, []);

  /**
   * Handle sending a friend request from modal
   */
  const handleSendRequest = useCallback(async (userId: string): Promise<boolean> => {
    const success = await sendRequest(userId);
    return success;
  }, [sendRequest]);

  /**
   * Handle cancelling an outgoing request (uses revokeAccess)
   */
  const handleCancelRequest = useCallback(async (friendshipId: string): Promise<boolean> => {
    return await revokeAccess(friendshipId);
  }, [revokeAccess]);

  // Count of pending incoming requests for badge
  const pendingCount = pendingIncoming.length;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Friends
            {pendingCount > 0 && (
              <IonBadge color="danger" style={{ marginLeft: '0.5rem' }}>
                {pendingCount}
              </IonBadge>
            )}
          </IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={activeTab} onIonChange={handleTabChange}>
            <IonSegmentButton value="friends">
              <IonLabel>Friends ({friends.length})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="pending">
              <IonLabel>
                Requests
                {pendingCount > 0 && (
                  <IonBadge color="danger" style={{ marginLeft: '0.5rem' }}>
                    {pendingCount}
                  </IonBadge>
                )}
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {loading && friends.length === 0 && pendingIncoming.length === 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <IonSpinner />
          </div>
        )}

        {activeTab === 'friends' && (
          <FriendsList
            friends={friends}
            onFriendClick={handleFriendClick}
          />
        )}

        {activeTab === 'pending' && (
          <PendingRequests
            incoming={pendingIncoming}
            outgoing={pendingOutgoing}
            onAccept={acceptRequest}
            onReject={rejectRequest}
            onCancel={handleCancelRequest}
          />
        )}

        {/* Floating Action Button */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={handleOpenAddModal}>
            <IonIcon icon={personAdd} />
          </IonFabButton>
        </IonFab>

        {/* Add Friend Modal */}
        <AddFriendModal
          isOpen={showAddModal}
          onClose={handleCloseAddModal}
          onSearch={searchUsers}
          onSendRequest={handleSendRequest}
        />
      </IonContent>
    </IonPage>
  );
};

export default FriendsPage;
