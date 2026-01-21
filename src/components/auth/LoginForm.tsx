/**
 * LoginForm component for user authentication.
 * Features email and password validation with Ionic UI components.
 */

import React, { useState, useCallback } from 'react';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSpinner,
  IonText,
  IonList,
  IonNote,
} from '@ionic/react';
import './LoginForm.css';

/**
 * Props for the LoginForm component
 */
export interface LoginFormProps {
  /** Callback when form is submitted with valid data */
  onSubmit: (email: string, password: string) => Promise<void>;
  /** Whether the form is currently submitting */
  isLoading?: boolean;
  /** Error message to display (from API, etc.) */
  error?: string | null;
}

/**
 * Email validation regex pattern
 * Matches standard email format: local@domain.tld
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Minimum password length requirement */
const MIN_PASSWORD_LENGTH = 6;

/**
 * LoginForm - Authentication form with email and password validation
 *
 * @example
 * ```tsx
 * <LoginForm
 *   onSubmit={async (email, password) => {
 *     await authService.login(email, password);
 *   }}
 *   isLoading={isSubmitting}
 *   error={loginError}
 * />
 * ```
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  error = null,
}) => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Validation error state
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Track if fields have been touched (for showing errors)
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  /**
   * Validate email format
   */
  const validateEmail = useCallback((value: string): string | null => {
    if (!value.trim()) {
      return 'Email is required';
    }
    if (!EMAIL_REGEX.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  }, []);

  /**
   * Validate password requirements
   */
  const validatePassword = useCallback((value: string): string | null => {
    if (!value) {
      return 'Password is required';
    }
    if (value.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }
    return null;
  }, []);

  /**
   * Handle email input change
   */
  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    if (emailTouched) {
      setEmailError(validateEmail(value));
    }
  }, [emailTouched, validateEmail]);

  /**
   * Handle password input change
   */
  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    if (passwordTouched) {
      setPasswordError(validatePassword(value));
    }
  }, [passwordTouched, validatePassword]);

  /**
   * Handle email field blur
   */
  const handleEmailBlur = useCallback(() => {
    setEmailTouched(true);
    setEmailError(validateEmail(email));
  }, [email, validateEmail]);

  /**
   * Handle password field blur
   */
  const handlePasswordBlur = useCallback(() => {
    setPasswordTouched(true);
    setPasswordError(validatePassword(password));
  }, [password, validatePassword]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    // Mark all fields as touched to show errors
    setEmailTouched(true);
    setPasswordTouched(true);
    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);

    // Don't submit if there are validation errors
    if (emailValidationError || passwordValidationError) {
      return;
    }

    // Call the submit handler
    await onSubmit(email, password);
  }, [email, password, validateEmail, validatePassword, onSubmit]);

  /**
   * Check if form can be submitted
   */
  const isFormValid = !validateEmail(email) && !validatePassword(password);

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {/* API Error Display */}
      {error && (
        <div className="login-form__error-banner">
          <IonText color="danger">
            <p className="login-form__error-text">{error}</p>
          </IonText>
        </div>
      )}

      <IonList className="login-form__fields">
        {/* Email Field */}
        <IonItem
          className={`login-form__item ${emailTouched && emailError ? 'ion-invalid' : ''}`}
        >
          <IonLabel position="stacked">Email</IonLabel>
          <IonInput
            type="email"
            value={email}
            placeholder="Enter your email"
            onIonInput={(e) => handleEmailChange(e.detail.value || '')}
            onIonBlur={handleEmailBlur}
            disabled={isLoading}
            autocomplete="email"
            inputmode="email"
            required
          />
          {emailTouched && emailError && (
            <IonNote slot="error" className="login-form__validation-error">
              {emailError}
            </IonNote>
          )}
        </IonItem>

        {/* Password Field */}
        <IonItem
          className={`login-form__item ${passwordTouched && passwordError ? 'ion-invalid' : ''}`}
        >
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput
            type="password"
            value={password}
            placeholder="Enter your password"
            onIonInput={(e) => handlePasswordChange(e.detail.value || '')}
            onIonBlur={handlePasswordBlur}
            disabled={isLoading}
            autocomplete="current-password"
            required
          />
          {passwordTouched && passwordError && (
            <IonNote slot="error" className="login-form__validation-error">
              {passwordError}
            </IonNote>
          )}
        </IonItem>
      </IonList>

      {/* Submit Button */}
      <div className="login-form__actions">
        <IonButton
          type="submit"
          expand="block"
          disabled={isLoading || !isFormValid}
          className="login-form__submit-btn"
        >
          {isLoading ? (
            <>
              <IonSpinner name="crescent" className="login-form__spinner" />
              <span>Signing in...</span>
            </>
          ) : (
            'Sign In'
          )}
        </IonButton>
      </div>
    </form>
  );
};

export default LoginForm;
