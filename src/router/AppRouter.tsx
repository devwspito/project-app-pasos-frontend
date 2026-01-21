import React from 'react';
import { IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from '../contexts/AuthContext';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Friends from '../pages/Friends';
import Goals from '../pages/Goals';
import Profile from '../pages/Profile';
import FriendDetailPage from '../pages/FriendDetailPage';

/**
 * Route configuration for the application.
 * Public routes: /login, /register
 * Protected routes: /dashboard, /friends, /goals, /profile
 */
const AppRouter: React.FC = () => {
  return (
    <AuthProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          <Switch>
            {/* Public Routes */}
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />

            {/* Protected Routes */}
            <ProtectedRoute exact path="/dashboard" component={Dashboard} />
            <ProtectedRoute exact path="/friends" component={Friends} />
            <ProtectedRoute exact path="/friends/:friendId" component={FriendDetailPage} />
            <ProtectedRoute exact path="/goals" component={Goals} />
            <ProtectedRoute exact path="/profile" component={Profile} />

            {/* Home route - protected, redirects to dashboard */}
            <ProtectedRoute exact path="/home" component={Home} />

            {/* Default redirect */}
            <Route exact path="/">
              <Redirect to="/dashboard" />
            </Route>

            {/* Catch-all redirect to dashboard */}
            <Route>
              <Redirect to="/dashboard" />
            </Route>
          </Switch>
        </IonRouterOutlet>
      </IonReactRouter>
    </AuthProvider>
  );
};

export default AppRouter;
