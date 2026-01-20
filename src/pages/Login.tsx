import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Login page placeholder component.
 * Provides a simple login interface with demo login functionality.
 */
const Login: React.FC = () => {
  const history = useHistory();
  const { login } = useAuth();

  const handleDemoLogin = async (): Promise<void> => {
    await login('demo@pasos.app', 'demo123');
    history.push('/dashboard');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>Welcome Back!</h1>
        <p>Login to access your Pasos account.</p>
        <IonButton expand="block" onClick={handleDemoLogin}>
          Demo Login
        </IonButton>
        <IonButton expand="block" fill="outline" routerLink="/register">
          Create Account
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
