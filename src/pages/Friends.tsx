import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

/**
 * Friends page placeholder component.
 * Shows friend list and social features.
 */
const Friends: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Friends</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>Friends</h1>
        <p>Connect with friends and compete in challenges.</p>
        <p>Your friends list and social features will appear here.</p>
      </IonContent>
    </IonPage>
  );
};

export default Friends;
