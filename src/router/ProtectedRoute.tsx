import React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps extends Omit<RouteProps, 'render' | 'component'> {
  component: React.ComponentType<RouteComponentProps>;
  redirectTo?: string;
}

/**
 * ProtectedRoute component that wraps routes requiring authentication.
 * If user is not authenticated, redirects to the specified path (default: /login).
 *
 * @param component - The component to render if authenticated
 * @param redirectTo - The path to redirect to if not authenticated (default: '/login')
 * @param rest - Additional RouteProps passed to the underlying Route
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  redirectTo = '/login',
  ...rest
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Route
      {...rest}
      render={(props: RouteComponentProps) => {
        // Show nothing while checking auth state
        if (isLoading) {
          return null;
        }

        // If authenticated, render the component
        if (isAuthenticated) {
          return <Component {...props} />;
        }

        // If not authenticated, redirect to login
        return (
          <Redirect
            to={{
              pathname: redirectTo,
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
};

export default ProtectedRoute;
