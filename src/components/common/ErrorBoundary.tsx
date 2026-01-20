import { Component, type ReactNode, type ErrorInfo } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { alertCircleOutline, refreshOutline } from 'ionicons/icons';

/**
 * Props for ErrorBoundary component
 */
export interface ErrorBoundaryProps {
  /** Child components to wrap */
  children: ReactNode;
  /** Optional custom fallback UI to show when an error occurs */
  fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactNode);
  /** Optional callback when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * State for ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary - A React error boundary component
 *
 * Catches JavaScript errors in child component tree and displays a fallback UI.
 * Must be a class component to use componentDidCatch lifecycle method.
 *
 * @example
 * ```tsx
 * // Basic usage with default fallback
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * // With custom fallback component
 * <ErrorBoundary fallback={<CustomErrorPage />}>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * // With fallback render function
 * <ErrorBoundary
 *   fallback={(error, resetError) => (
 *     <div>
 *       <p>Error: {error.message}</p>
 *       <button onClick={resetError}>Try Again</button>
 *     </div>
 *   )}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * // With error callback
 * <ErrorBoundary onError={(error, info) => logErrorToService(error, info)}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * Update state when an error is thrown
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error information when caught
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);

    // Call optional onError callback
    this.props.onError?.(error, errorInfo);
  }

  /**
   * Reset error state to retry rendering
   */
  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      // Render custom fallback if provided
      if (fallback !== undefined) {
        if (typeof fallback === 'function') {
          return fallback(error, this.resetError);
        }
        return fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary-fallback flex flex-col items-center justify-center p-lg text-center">
          <IonIcon
            icon={alertCircleOutline}
            color="danger"
            style={{ fontSize: '3rem' }}
            aria-hidden="true"
          />
          <h3 className="mt-md mb-sm font-semibold">Something went wrong</h3>
          <p className="text-medium text-small mb-md">
            An unexpected error occurred. Please try again.
          </p>
          {import.meta.env.DEV && (
            <p className="text-danger text-xs mb-md font-medium">
              {error.message}
            </p>
          )}
          <IonButton
            onClick={this.resetError}
            color="primary"
            size="default"
          >
            <IonIcon icon={refreshOutline} slot="start" />
            Try Again
          </IonButton>
        </div>
      );
    }

    return children;
  }
}
