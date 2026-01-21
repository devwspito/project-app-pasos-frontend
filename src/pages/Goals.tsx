import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

/**
 * Goals page placeholder component.
 * Shows fitness goals and progress tracking.
 */
const Goals: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Goals</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>Goals</h1>
        <p>Set and track your fitness goals.</p>
        <p>Your goals and progress will be displayed here.</p>
      </IonContent>
    </IonPage>
  );
};

export default Goals;
