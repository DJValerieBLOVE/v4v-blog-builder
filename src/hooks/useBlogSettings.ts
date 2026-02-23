import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { 
  type BlogSettings, 
  defaultBlogSettings,
} from '@/lib/blogSettings';

const SETTINGS_D_TAG = 'v4v-blog-settings';

/**
 * Deep merge blog settings - merges source into target
 */
function mergeBlogSettings(target: BlogSettings, source: Partial<BlogSettings>): BlogSettings {
  const result = { ...target };

  // Merge identity
  if (source.identity) {
    result.identity = {
      ...target.identity,
      ...source.identity,
      logo: source.identity.logo 
        ? { ...target.identity.logo, ...source.identity.logo }
        : target.identity.logo,
    };
  }

  // Merge theme
  if (source.theme) {
    result.theme = {
      ...target.theme,
      ...source.theme,
      colors: source.theme.colors 
        ? { ...target.theme.colors, ...source.theme.colors }
        : target.theme.colors,
      darkMode: source.theme.darkMode
        ? { ...target.theme.darkMode, ...source.theme.darkMode }
        : target.theme.darkMode,
      fonts: source.theme.fonts
        ? { ...target.theme.fonts, ...source.theme.fonts }
        : target.theme.fonts,
    };
  }

  // Merge hero
  if (source.hero) {
    result.hero = {
      ...target.hero,
      ...source.hero,
    };
  }

  // Merge newsletter
  if (source.newsletter) {
    result.newsletter = {
      ...target.newsletter,
      ...source.newsletter,
    };
  }

  // Merge social
  if (source.social) {
    result.social = {
      ...target.social,
      ...source.social,
    };
  }

  // Simple overwrites
  if (source.version !== undefined) result.version = source.version;
  if (source.categories !== undefined) result.categories = source.categories;
  if (source.navigation !== undefined) result.navigation = source.navigation;

  return result;
}

/**
 * Hook to fetch blog settings from Nostr (kind:30078)
 */
export function useBlogSettings(authorPubkey?: string) {
  const { user } = useCurrentUser();
  const { nostr } = useNostr();
  
  // Use logged-in user's pubkey if no author specified
  const pubkey = authorPubkey ?? user?.pubkey;

  return useQuery({
    queryKey: ['blog-settings', pubkey],
    queryFn: async (): Promise<BlogSettings> => {
      if (!pubkey) return defaultBlogSettings;

      const events = await nostr.query([
        {
          kinds: [30078],
          authors: [pubkey],
          '#d': [SETTINGS_D_TAG],
          limit: 1,
        },
      ]);

      const event = events[0];
      if (!event) return defaultBlogSettings;

      try {
        const settings = JSON.parse(event.content) as Partial<BlogSettings>;
        return mergeBlogSettings(defaultBlogSettings, settings);
      } catch {
        return defaultBlogSettings;
      }
    },
    enabled: Boolean(pubkey),
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook to update blog settings
 */
export function useUpdateBlogSettings() {
  const { user } = useCurrentUser();
  const { mutateAsync: createEvent } = useNostrPublish();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<BlogSettings>) => {
      if (!user) throw new Error('Must be logged in to update settings');

      // Fetch current settings
      const currentSettings = queryClient.getQueryData<BlogSettings>(['blog-settings', user.pubkey]) 
        ?? defaultBlogSettings;

      // Merge new settings with current
      const updatedSettings = mergeBlogSettings(currentSettings, settings);

      // Publish to Nostr
      await createEvent({
        kind: 30078,
        content: JSON.stringify(updatedSettings),
        tags: [
          ['d', SETTINGS_D_TAG],
          ['alt', 'Blog settings for V4V Blog Builder'],
        ],
      });

      return updatedSettings;
    },
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(['blog-settings', user?.pubkey], data);
    },
  });
}
