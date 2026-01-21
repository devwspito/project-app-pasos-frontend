import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

/**
 * Dashboard page placeholder component.
 * Main authenticated landing page showing step tracking overview.
 */
const Dashboard: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>Dashboard</h1>
        <p>Your daily step tracking overview will appear here.</p>
        <p>Track your progress and view statistics.</p>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
