import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { defaultTabs, type TabConfig } from './tabs.config';

/**
 * Props for TabBar component
 */
export interface TabBarProps {
  /** Optional custom tab configuration */
  tabs?: TabConfig[];
  /** Optional slot position (default: 'bottom') */
  slot?: 'bottom' | 'top';
}

/**
 * TabBar - Presentational component for bottom navigation
 *
 * Renders IonTabBar with IonTabButtons for each tab.
 * Uses Ionicons for tab icons.
 *
 * @example
 * ```tsx
 * // Using default tabs
 * <TabBar />
 *
 * // Using custom tabs
 * <TabBar tabs={customTabs} />
 * ```
 */
export function TabBar({ tabs = defaultTabs, slot = 'bottom' }: TabBarProps) {
  return (
    <IonTabBar slot={slot}>
      {tabs.map(({ tab, href, icon, label }) => (
        <IonTabButton key={tab} tab={tab} href={href}>
          <IonIcon icon={icon} aria-hidden="true" />
          <IonLabel>{label}</IonLabel>
        </IonTabButton>
      ))}
    </IonTabBar>
  );
}
