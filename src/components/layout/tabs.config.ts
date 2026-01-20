import { home, people, flag, person } from 'ionicons/icons';

/**
 * Tab configuration type
 */
export interface TabConfig {
  /** Route tab ID that matches the IonRouterOutlet route */
  tab: string;
  /** URL path for the tab */
  href: string;
  /** Ionicon icon name */
  icon: string;
  /** Display label for the tab */
  label: string;
}

/**
 * Default tab configuration for the app
 * Dashboard, Friends, Goals, Profile
 */
export const defaultTabs: TabConfig[] = [
  { tab: 'dashboard', href: '/dashboard', icon: home, label: 'Dashboard' },
  { tab: 'friends', href: '/friends', icon: people, label: 'Friends' },
  { tab: 'goals', href: '/goals', icon: flag, label: 'Goals' },
  { tab: 'profile', href: '/profile', icon: person, label: 'Profile' },
];
