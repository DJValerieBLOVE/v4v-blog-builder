import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { useBlogSettings } from '@/hooks/useBlogSettings';
import { useTheme } from '@/hooks/useTheme';
import { 
  type BlogSettings, 
  defaultBlogSettings,
  hexToHsl,
} from '@/lib/blogSettings';

interface BlogSettingsContextValue {
  settings: BlogSettings;
  isLoading: boolean;
}

const BlogSettingsContext = createContext<BlogSettingsContextValue>({
  settings: defaultBlogSettings,
  isLoading: true,
});

interface BlogSettingsProviderProps {
  authorPubkey?: string;
  children: ReactNode;
}

export function BlogSettingsProvider({ authorPubkey, children }: BlogSettingsProviderProps) {
  const { data: settings, isLoading } = useBlogSettings(authorPubkey);
  const { theme } = useTheme();

  // Apply theme colors as CSS variables
  useEffect(() => {
    if (!settings) return;

    const root = document.documentElement;
    const isDark = theme === 'dark' && settings.theme.darkMode.enabled;
    const colors = isDark 
      ? { ...settings.theme.colors, ...settings.theme.darkMode.colors }
      : settings.theme.colors;

    // Set primary color (buttons only - NOT accent/hover states)
    if (colors.primary) {
      root.style.setProperty('--primary', hexToHsl(colors.primary));
      root.style.setProperty('--ring', hexToHsl(colors.primary));
    }
    
    // CRITICAL: Accent color for hover states must ALWAYS be very light
    // NEVER use muted (which can be gray) or primary (which is dark)
    // Use a fixed near-white color: 0 0% 98% (almost white)
    root.style.setProperty('--accent', '0 0% 98%');
    root.style.setProperty('--accent-foreground', hexToHsl(colors.foreground || '#18181B'));
    
    // Also ensure secondary and muted-background are light for hover states
    root.style.setProperty('--secondary', '0 0% 98%');
    root.style.setProperty('--sidebar-accent', '0 0% 98%');

    // Set background color
    if (colors.background) {
      root.style.setProperty('--background', hexToHsl(colors.background));
    }

    // Set text color (foreground)
    if (colors.foreground) {
      root.style.setProperty('--foreground', hexToHsl(colors.foreground));
      root.style.setProperty('--card-foreground', hexToHsl(colors.foreground));
      root.style.setProperty('--popover-foreground', hexToHsl(colors.foreground));
    }

    // Set card background
    if (colors.card) {
      root.style.setProperty('--card', hexToHsl(colors.card));
      root.style.setProperty('--popover', hexToHsl(colors.card));
    }

    // Set muted color
    if (colors.muted) {
      root.style.setProperty('--muted', hexToHsl(colors.muted));
      root.style.setProperty('--secondary', hexToHsl(colors.muted));
    }

    // Set border color
    if (colors.border) {
      root.style.setProperty('--border', hexToHsl(colors.border));
      root.style.setProperty('--input', hexToHsl(colors.border));
    }

    // Set border radius
    const radiusMap = {
      none: '0',
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      full: '9999px',
    };
    root.style.setProperty('--radius', radiusMap[settings.theme.borderRadius] ?? '0.5rem');

  }, [settings, theme]);

  const value = useMemo(() => ({
    settings: settings ?? defaultBlogSettings,
    isLoading,
  }), [settings, isLoading]);

  return (
    <BlogSettingsContext.Provider value={value}>
      {children}
    </BlogSettingsContext.Provider>
  );
}

export function useBlogSettingsContext() {
  return useContext(BlogSettingsContext);
}
