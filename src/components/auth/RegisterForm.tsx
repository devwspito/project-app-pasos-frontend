/**
 * RegisterForm component for user registration.
 * Features username, email, and password validation with Ionic UI components.
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSpinner,
  IonText,
  IonList,
  IonNote,
  IonProgressBar,
} from '@ionic/react';
import './RegisterForm.css';

/**
 * Props for the RegisterForm component
 */
export interface RegisterFormProps {
  /** Callback when form is submitted with valid data */
  onSubmit: (username: string, email: string, password: string) => Promise<void>;
  /** Whether the form is currently submitting */
  isLoading?: boolean;
  /** Error message to display (from API, etc.) */
  error?: string | null;
}

/**
 * Email validation regex pattern
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Username constraints */
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 20;

/** Password constraints */
const MIN_PASSWORD_LENGTH = 8;
const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
const PASSWORD_NUMBER_REGEX = /\d/;

/**
 * Password strength levels
 */
type PasswordStrength = 'weak' | 'medium' | 'strong';

/**
 * Calculate password strength
 */
const calculatePasswordStrength = (password: string): PasswordStrength => {
  let score = 0;

  if (password.length >= MIN_PASSWORD_LENGTH) score++;
  if (password.length >= 12) score++;
  if (PASSWORD_UPPERCASE_REGEX.test(password)) score++;
  if (PASSWORD_NUMBER_REGEX.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  if (score <= 2) return 'weak';
  if (score <= 3) return 'medium';
  return 'strong';
};

/**
 * Get password strength color
 */
const getStrengthColor = (strength: PasswordStrength): string => {
  switch (strength) {
    case 'weak':
      return 'danger';
    case 'medium':
      return 'warning';
    case 'strong':
      return 'success';
  }
};

/**
 * Get password strength progress value
 */
const getStrengthProgress = (strength: PasswordStrength): number => {
  switch (strength) {
    case 'weak':
      return 0.33;
    case 'medium':
      return 0.66;
    case 'strong':
      return 1;
  }
};

/**
 * RegisterForm - Registration form with comprehensive validation
 *
 * @example
 * ```tsx
 * <RegisterForm
 *   onSubmit={async (username, email, password) => {
 *     await authService.register(username, email, password);
 *   }}
 *   isLoading={isSubmitting}
 *   error={registerError}
 * />
 * ```
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading = false,
  error = null,
}) => {
  // Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Validation error state
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  // Track if fields have been touched
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  /**
   * Calculate password strength
   */
  const passwordStrength = useMemo(() => {
    if (!password) return null;
    return calculatePasswordStrength(password);
  }, [password]);

  /**
   * Validate username
   */
  const validateUsername = useCallback((value: string): string | null => {
    if (!value.trim()) {
      return 'Username is required';
    }
    if (value.length < MIN_USERNAME_LENGTH) {
      return `Username must be at least ${MIN_USERNAME_LENGTH} characters`;
    }
    if (value.length > MAX_USERNAME_LENGTH) {
      return `Username must be at most ${MAX_USERNAME_LENGTH} characters`;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return null;
  }, []);

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
    if (!PASSWORD_UPPERCASE_REGEX.test(value)) {
      return 'Password must contain at least 1 uppercase letter';
    }
    if (!PASSWORD_NUMBER_REGEX.test(value)) {
      return 'Password must contain at least 1 number';
    }
    return null;
  }, []);

  /**
   * Validate confirm password
   */
  const validateConfirmPassword = useCallback((value: string, currentPassword: string): string | null => {
    if (!value) {
      return 'Please confirm your password';
    }
    if (value !== currentPassword) {
      return 'Passwords do not match';
    }
    return null;
  }, []);

  /**
   * Handle username input change
   */
  const handleUsernameChange = useCallback((value: string) => {
    setUsername(value);
    if (usernameTouched) {
      setUsernameError(validateUsername(value));
    }
  }, [usernameTouched, validateUsername]);

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
    // Also revalidate confirm password if it was touched
    if (confirmPasswordTouched && confirmPassword) {
      setConfirmPasswordError(validateConfirmPassword(confirmPassword, value));
    }
  }, [passwordTouched, confirmPasswordTouched, confirmPassword, validatePassword, validateConfirmPassword]);

  /**
   * Handle confirm password input change
   */
  const handleConfirmPasswordChange = useCallback((value: string) => {
    setConfirmPassword(value);
    if (confirmPasswordTouched) {
      setConfirmPasswordError(validateConfirmPassword(value, password));
    }
  }, [confirmPasswordTouched, password, validateConfirmPassword]);

  /**
   * Handle username field blur
   */
  const handleUsernameBlur = useCallback(() => {
    setUsernameTouched(true);
    setUsernameError(validateUsername(username));
  }, [username, validateUsername]);

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
   * Handle confirm password field blur
   */
  const handleConfirmPasswordBlur = useCallback(() => {
    setConfirmPasswordTouched(true);
    setConfirmPasswordError(validateConfirmPassword(confirmPassword, password));
  }, [confirmPassword, password, validateConfirmPassword]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const usernameValidationError = validateUsername(username);
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);
    const confirmPasswordValidationError = validateConfirmPassword(confirmPassword, password);

    // Mark all fields as touched
    setUsernameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);

    // Set all validation errors
    setUsernameError(usernameValidationError);
    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);
    setConfirmPasswordError(confirmPasswordValidationError);

    // Don't submit if there are validation errors
    if (
      usernameValidationError ||
      emailValidationError ||
      passwordValidationError ||
      confirmPasswordValidationError
    ) {
      return;
    }

    // Call the submit handler
    await onSubmit(username, email, password);
  }, [
    username,
    email,
    password,
    confirmPassword,
    validateUsername,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    onSubmit,
  ]);

  /**
   * Check if form can be submitted
   */
  const isFormValid =
    !validateUsername(username) &&
    !validateEmail(email) &&
    !validatePassword(password) &&
    !validateConfirmPassword(confirmPassword, password);

  return (
    <form onSubmit={handleSubmit} className="register-form">
      {/* API Error Display */}
      {error && (
        <div className="register-form__error-banner">
          <IonText color="danger">
            <p className="register-form__error-text">{error}</p>
          </IonText>
        </div>
      )}

      <IonList className="register-form__fields">
        {/* Username Field */}
        <IonItem
          className={`register-form__item ${usernameTouched && usernameError ? 'ion-invalid' : ''}`}
        >
          <IonLabel position="stacked">Username</IonLabel>
          <IonInput
            type="text"
            value={username}
            placeholder="Choose a username"
            onIonInput={(e) => handleUsernameChange(e.detail.value || '')}
            onIonBlur={handleUsernameBlur}
            disabled={isLoading}
            autocomplete="username"
            minlength={MIN_USERNAME_LENGTH}
            maxlength={MAX_USERNAME_LENGTH}
            required
          />
          {usernameTouched && usernameError && (
            <IonNote slot="error" className="register-form__validation-error">
              {usernameError}
            </IonNote>
          )}
          <IonNote slot="helper" className="register-form__hint">
            {MIN_USERNAME_LENGTH}-{MAX_USERNAME_LENGTH} characters, letters, numbers, underscores
          </IonNote>
        </IonItem>

        {/* Email Field */}
        <IonItem
          className={`register-form__item ${emailTouched && emailError ? 'ion-invalid' : ''}`}
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
            <IonNote slot="error" className="register-form__validation-error">
              {emailError}
            </IonNote>
          )}
        </IonItem>

        {/* Password Field */}
        <IonItem
          className={`register-form__item ${passwordTouched && passwordError ? 'ion-invalid' : ''}`}
        >
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput
            type="password"
            value={password}
            placeholder="Create a password"
            onIonInput={(e) => handlePasswordChange(e.detail.value || '')}
            onIonBlur={handlePasswordBlur}
            disabled={isLoading}
            autocomplete="new-password"
            required
          />
          {passwordTouched && passwordError && (
            <IonNote slot="error" className="register-form__validation-error">
              {passwordError}
            </IonNote>
          )}
          <IonNote slot="helper" className="register-form__hint">
            Min 8 characters, 1 uppercase, 1 number
          </IonNote>
        </IonItem>

        {/* Password Strength Indicator */}
        {password && passwordStrength && (
          <div className="register-form__strength-container">
            <IonProgressBar
              value={getStrengthProgress(passwordStrength)}
              color={getStrengthColor(passwordStrength)}
              className="register-form__strength-bar"
            />
            <IonText
              color={getStrengthColor(passwordStrength)}
              className="register-form__strength-label"
            >
              <span>Password strength: {passwordStrength}</span>
            </IonText>
          </div>
        )}

        {/* Confirm Password Field */}
        <IonItem
          className={`register-form__item ${confirmPasswordTouched && confirmPasswordError ? 'ion-invalid' : ''}`}
        >
          <IonLabel position="stacked">Confirm Password</IonLabel>
          <IonInput
            type="password"
            value={confirmPassword}
            placeholder="Confirm your password"
            onIonInput={(e) => handleConfirmPasswordChange(e.detail.value || '')}
            onIonBlur={handleConfirmPasswordBlur}
            disabled={isLoading}
            autocomplete="new-password"
            required
          />
          {confirmPasswordTouched && confirmPasswordError && (
            <IonNote slot="error" className="register-form__validation-error">
              {confirmPasswordError}
            </IonNote>
          )}
        </IonItem>
      </IonList>

      {/* Submit Button */}
      <div className="register-form__actions">
        <IonButton
          type="submit"
          expand="block"
          disabled={isLoading || !isFormValid}
          className="register-form__submit-btn"
        >
          {isLoading ? (
            <>
              <IonSpinner name="crescent" className="register-form__spinner" />
              <span>Creating account...</span>
            </>
          ) : (
            'Create Account'
          )}
        </IonButton>
      </div>
    </form>
  );
};

export default RegisterForm;
