import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

/**
 * Available theme modes for the application
 * - 'light': Light theme (removes 'dark' class from body)
 * - 'dark': Dark theme (adds 'dark' class to body)
 * - 'system': Follows OS/browser preference via prefers-color-scheme
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * The resolved theme (what's actually applied to the UI)
 * 'system' resolves to either 'light' or 'dark' based on system preference
 */
export type ResolvedTheme = 'light' | 'dark';

/**
 * Theme context value interface
 */
export interface ThemeContextValue {
  /** Current theme mode setting (can be 'system') */
  theme: ThemeMode;
  /** Resolved theme that's actually applied (never 'system') */
  resolvedTheme: ResolvedTheme;
  /** Set theme to a specific mode */
  setTheme: (theme: ThemeMode) => void;
  /** Toggle between light and dark (ignores system) */
  toggleTheme: () => void;
}

// Storage key for localStorage persistence
const STORAGE_KEY = 'theme-preference';

/**
 * Create the theme context with undefined default
 * Consumers must use useTheme hook which throws if context is undefined
 */
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Get the system's preferred color scheme
 */
function getSystemTheme(): ResolvedTheme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

/**
 * Get the stored theme preference from localStorage
 */
function getStoredTheme(): ThemeMode | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    // localStorage not available (e.g., private browsing in some browsers)
  }
  return null;
}

/**
 * Store theme preference to localStorage
 */
function storeTheme(theme: ThemeMode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage not available
  }
}

/**
 * Resolve theme mode to actual applied theme
 */
function resolveTheme(theme: ThemeMode): ResolvedTheme {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
}

/**
 * Apply theme to document body by toggling 'dark' class
 */
function applyThemeToBody(resolved: ResolvedTheme): void {
  if (typeof document !== 'undefined') {
    if (resolved === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}

/**
 * Props for ThemeProvider component
 */
export interface ThemeProviderProps {
  children: ReactNode;
  /** Optional default theme if no stored preference exists */
  defaultTheme?: ThemeMode;
}

/**
 * ThemeProvider component - wraps app and provides theme context
 *
 * Features:
 * - Persists user preference to localStorage
 * - Auto-detects system preference on first load
 * - Respects stored preference over system preference
 * - Applies 'dark' class to body for CSS variable switching
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  // Initialize theme from stored preference or default to system
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const stored = getStoredTheme();
    return stored ?? defaultTheme;
  });

  // Track resolved theme for system preference changes
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(theme));

  // Set theme and persist to localStorage
  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    storeTheme(newTheme);
  }, []);

  // Toggle between light and dark (explicit user choice, not system)
  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) => {
      const currentResolved = resolveTheme(currentTheme);
      const newTheme: ThemeMode = currentResolved === 'dark' ? 'light' : 'dark';
      storeTheme(newTheme);
      return newTheme;
    });
  }, []);

  // Apply theme to body when theme changes
  useEffect(() => {
    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);
    applyThemeToBody(resolved);
  }, [theme]);

  // Listen for system preference changes when theme is 'system'
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const newResolved: ResolvedTheme = e.matches ? 'dark' : 'light';
      setResolvedTheme(newResolved);
      applyThemeToBody(newResolved);
    };

    // Modern browsers
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}
