import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/auth';

/**
 * Login page component.
 * Integrates LoginForm with useAuth hook for authentication.
 */
const Login: React.FC = () => {
  const history = useHistory();
  const { login, isLoading } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  /**
   * Handle form submission with error handling
   */
  const handleSubmit = async (email: string, password: string): Promise<void> => {
    try {
      setLocalError(null);
      await login(email, password);
      history.push('/dashboard');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  /**
   * Demo login handler for development fallback
   */
  const handleDemoLogin = async (): Promise<void> => {
    try {
      setLocalError(null);
      await login('demo@pasos.app', 'demo123');
      history.push('/dashboard');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Demo login failed.');
    }
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

        <LoginForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={localError}
        />

        <div style={{ marginTop: '16px' }}>
          <IonButton expand="block" fill="outline" onClick={handleDemoLogin} disabled={isLoading}>
            Demo Login
          </IonButton>
        </div>

        <IonButton expand="block" fill="clear" routerLink="/register">
          Don't have an account? Register
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
