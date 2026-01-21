import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RegisterForm } from '../components/auth';

/**
 * Register page component.
 * Integrates RegisterForm with useAuth hook for registration.
 */
const Register: React.FC = () => {
  const history = useHistory();
  const { register, isLoading } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  /**
   * Handle form submission with error handling
   * Note: RegisterForm provides (username, email, password)
   *       AuthContext's register expects (email, password, name)
   */
  const handleSubmit = async (username: string, email: string, password: string): Promise<void> => {
    try {
      setLocalError(null);
      // Map RegisterForm params to AuthContext params
      await register(email, password, username);
      history.push('/dashboard');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  };

  /**
   * Demo registration handler for development fallback
   */
  const handleDemoRegister = async (): Promise<void> => {
    try {
      setLocalError(null);
      await register('newuser@pasos.app', 'demo123', 'New User');
      history.push('/dashboard');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Demo registration failed.');
    }
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

        <RegisterForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={localError}
        />

        <div style={{ marginTop: '16px' }}>
          <IonButton expand="block" fill="outline" onClick={handleDemoRegister} disabled={isLoading}>
            Demo Registration
          </IonButton>
        </div>

        <IonButton expand="block" fill="clear" routerLink="/login">
          Already have an account? Login
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Register;
