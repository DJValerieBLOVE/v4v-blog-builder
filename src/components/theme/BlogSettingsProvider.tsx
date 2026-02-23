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

    // Set primary color
    if (colors.primary) {
      root.style.setProperty('--primary', hexToHsl(colors.primary));
    }

    // Set border radius
    const radiusMap = {
      none: '0',
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      full: '9999px',
    };
    root.style.setProperty('--radius', radiusMap[settings.theme.borderRadius] ?? '0.75rem');

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
