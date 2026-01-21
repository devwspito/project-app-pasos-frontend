import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

/**
 * Home page placeholder component.
 * This redirects to dashboard as the main authenticated landing page.
 */
const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Pasos - Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>Welcome to Pasos!</h1>
        <p>Your step counter and fitness tracking app.</p>
        <p>Navigate using the tabs below to explore the app.</p>
      </IonContent>
    </IonPage>
  );
};

export default Home;
