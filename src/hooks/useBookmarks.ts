import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';

/**
 * Hook to fetch user's bookmarked articles (kind:10003)
 * Uses NIP-51 public bookmark list
 */
export function useBookmarks() {
  const { user } = useCurrentUser();
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['bookmarks', user?.pubkey],
    queryFn: async (): Promise<string[]> => {
      if (!user?.pubkey) return [];

      const events = await nostr.query([
        {
          kinds: [10003],
          authors: [user.pubkey],
          limit: 1,
        },
      ]);

      const event = events[0];
      if (!event) return [];

      // Extract 'a' tags for addressable events (articles)
      return event.tags
        .filter(([name]) => name === 'a')
        .map(([, value]) => value);
    },
    enabled: Boolean(user?.pubkey),
  });
}

interface ToggleBookmarkParams {
  aTag: string;
  isCurrentlyBookmarked: boolean;
}

/**
 * Hook to toggle a bookmark on/off
 */
export function useToggleBookmark() {
  const { user } = useCurrentUser();
  const { nostr } = useNostr();
  const { mutateAsync: createEvent } = useNostrPublish();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ aTag, isCurrentlyBookmarked }: ToggleBookmarkParams) => {
      if (!user?.pubkey) throw new Error('Not logged in');

      // Fetch current bookmarks list
      const events = await nostr.query([
        {
          kinds: [10003],
          authors: [user.pubkey],
          limit: 1,
        },
      ]);

      const currentEvent = events[0];
      const currentTags = currentEvent?.tags ?? [];

      // Get all non-'a' tags and current 'a' tags
      const otherTags = currentTags.filter(([name]) => name !== 'a');
      const aTags = currentTags.filter(([name]) => name === 'a');

      let newATags: string[][];

      if (isCurrentlyBookmarked) {
        // Remove the bookmark
        newATags = aTags.filter(([, value]) => value !== aTag);
      } else {
        // Add the bookmark
        newATags = [...aTags, ['a', aTag]];
      }

      // Create updated bookmark list event
      await createEvent({
        kind: 10003,
        content: '',
        tags: [...otherTags, ...newATags],
      });
    },
    onSuccess: () => {
      // Invalidate bookmarks query to refetch
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}

/**
 * Hook to check if an article is bookmarked
 */
export function useIsBookmarked(authorPubkey: string, slug: string): boolean {
  const { data: bookmarks } = useBookmarks();
  const aTag = `30023:${authorPubkey}:${slug}`;
  return bookmarks?.includes(aTag) ?? false;
}
