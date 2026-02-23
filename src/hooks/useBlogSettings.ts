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
        // Merge with defaults to ensure all fields exist
        return deepMerge(defaultBlogSettings as Record<string, unknown>, settings as Record<string, unknown>) as BlogSettings;
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
      const updatedSettings = deepMerge(currentSettings as Record<string, unknown>, settings as Record<string, unknown>);

      // Publish to Nostr
      await createEvent({
        kind: 30078,
        content: JSON.stringify(updatedSettings),
        tags: [
          ['d', SETTINGS_D_TAG],
          ['alt', 'Blog settings for V4V Blog Builder'],
        ],
      });

      return updatedSettings as BlogSettings;
    },
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(['blog-settings', user?.pubkey], data);
    },
  });
}

/**
 * Deep merge two objects - simplified version for BlogSettings
 */
function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (
        sourceValue !== null &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue !== null &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        );
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue;
      }
    }
  }

  return result;
}
