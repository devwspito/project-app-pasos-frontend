import { useContext } from 'react';
import { ThemeContext, type ThemeContextValue } from '../contexts/ThemeContext';

/**
 * Custom hook to access theme context
 *
 * Provides:
 * - theme: Current theme mode ('light' | 'dark' | 'system')
 * - resolvedTheme: Actual applied theme ('light' | 'dark')
 * - setTheme: Function to set theme to specific mode
 * - toggleTheme: Function to toggle between light/dark
 *
 * @throws Error if used outside of ThemeProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, resolvedTheme, toggleTheme } = useTheme();
 *
 *   return (
 *     <button onClick={toggleTheme}>
 *       Current: {resolvedTheme} (setting: {theme})
 *     </button>
 *   );
 * }
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
