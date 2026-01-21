import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useAuth } from '../hooks/useAuth';

/**
 * Profile page placeholder component.
 * Shows user profile and settings.
 */
const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = (): void => {
    logout();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>Profile</h1>
        {user && (
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
        <p>Manage your account settings and preferences.</p>
        <IonButton expand="block" color="danger" onClick={handleLogout}>
          Logout
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
