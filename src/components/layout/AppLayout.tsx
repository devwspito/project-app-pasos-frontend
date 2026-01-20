import { IonTabs, IonRouterOutlet } from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import { TabBar } from './TabBar';
import { type TabConfig } from './tabs.config';

/**
 * Props for AppLayout component
 */
export interface AppLayoutProps {
  /** Optional custom tab configuration */
  tabs?: TabConfig[];
  /** Route render props for each tab - map of tab name to component */
  routes: {
    dashboard?: React.ComponentType;
    friends?: React.ComponentType;
    goals?: React.ComponentType;
    profile?: React.ComponentType;
  };
}

/**
 * Placeholder component for routes that don't have a component yet
 */
function PlaceholderPage({ name }: { name: string }) {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>{name}</h2>
      <p>This page is under construction.</p>
    </div>
  );
}

/**
 * AppLayout - Main layout with IonTabs navigation
 *
 * Wraps the app with IonTabs containing an IonRouterOutlet
 * for route management and a TabBar for bottom navigation.
 *
 * Note: Route definitions should be kept minimal here.
 * Full routing logic should be in AppRouter component.
 *
 * @example
 * ```tsx
 * <AppLayout
 *   routes={{
 *     dashboard: DashboardPage,
 *     friends: FriendsPage,
 *     goals: GoalsPage,
 *     profile: ProfilePage,
 *   }}
 * />
 * ```
 */
export function AppLayout({ tabs, routes }: AppLayoutProps) {
  const DashboardComponent = routes.dashboard ?? (() => <PlaceholderPage name="Dashboard" />);
  const FriendsComponent = routes.friends ?? (() => <PlaceholderPage name="Friends" />);
  const GoalsComponent = routes.goals ?? (() => <PlaceholderPage name="Goals" />);
  const ProfileComponent = routes.profile ?? (() => <PlaceholderPage name="Profile" />);

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/dashboard">
          <DashboardComponent />
        </Route>
        <Route exact path="/friends">
          <FriendsComponent />
        </Route>
        <Route exact path="/goals">
          <GoalsComponent />
        </Route>
        <Route exact path="/profile">
          <ProfileComponent />
        </Route>
        <Route exact path="/">
          <Redirect to="/dashboard" />
        </Route>
      </IonRouterOutlet>
      <TabBar tabs={tabs} />
    </IonTabs>
  );
}
