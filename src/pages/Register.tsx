import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Register page placeholder component.
 * Provides a simple registration interface with demo registration functionality.
 */
const Register: React.FC = () => {
  const history = useHistory();
  const { register } = useAuth();

  const handleDemoRegister = async (): Promise<void> => {
    await register('newuser@pasos.app', 'demo123', 'New User');
    history.push('/dashboard');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>Create Account</h1>
        <p>Join Pasos to start tracking your fitness journey.</p>
        <IonButton expand="block" onClick={handleDemoRegister}>
          Demo Registration
        </IonButton>
        <IonButton expand="block" fill="outline" routerLink="/login">
          Already have an account? Login
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Register;
