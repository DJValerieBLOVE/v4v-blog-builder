import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import type { NostrEvent } from '@nostrify/nostrify';

interface ArticleEngagement {
  /** Total number of reactions (kind:7 with + content) */
  likes: number;
  /** List of pubkeys who liked */
  likerPubkeys: string[];
  /** Total number of reposts (kind:6 and kind:16) */
  reposts: number;
  /** List of pubkeys who reposted */
  reposterPubkeys: string[];
  /** Total number of comments (kind:1111) */
  comments: number;
  /** Comment events */
  commentEvents: NostrEvent[];
  /** Total zap amount in sats */
  zapTotal: number;
  /** Number of zaps */
  zapCount: number;
  /** Zap receipt events */
  zapEvents: NostrEvent[];
  /** Raw events for further processing */
  events: NostrEvent[];
}

/**
 * Hook to fetch all engagement data for an article
 */
export function useArticleEngagement(authorPubkey: string | undefined, slug: string | undefined) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['article-engagement', authorPubkey, slug],
    queryFn: async (): Promise<ArticleEngagement> => {
      if (!authorPubkey || !slug) {
        return {
          likes: 0,
          likerPubkeys: [],
          reposts: 0,
          reposterPubkeys: [],
          comments: 0,
          commentEvents: [],
          zapTotal: 0,
          zapCount: 0,
          zapEvents: [],
          events: [],
        };
      }

      // Create the addressable event reference (a-tag)
      const aTag = `30023:${authorPubkey}:${slug}`;

      // Query all engagement types in a single request
      const events = await nostr.query([
        {
          kinds: [7, 6, 16, 1111, 9735],
          '#a': [aTag],
          limit: 500,
        },
      ]);

      // Separate by type
      const reactions = events.filter((e) => e.kind === 7);
      const reposts = events.filter((e) => e.kind === 6 || e.kind === 16);
      const comments = events.filter((e) => e.kind === 1111);
      const zaps = events.filter((e) => e.kind === 9735);

      // Count likes (reactions with + or empty content count as likes)
      const likes = reactions.filter(
        (e) => e.content === '+' || e.content === '' || e.content === '❤️' || e.content === '👍'
      );

      // Calculate total zap amount from bolt11 invoices
      let zapTotal = 0;
      for (const zap of zaps) {
        const amountTag = zap.tags.find(([name]) => name === 'amount');
        if (amountTag) {
          const amount = parseInt(amountTag[1], 10);
          if (!isNaN(amount)) {
            zapTotal += Math.floor(amount / 1000); // Convert millisats to sats
          }
        }
      }

      return {
        likes: likes.length,
        likerPubkeys: [...new Set(likes.map((e) => e.pubkey))],
        reposts: reposts.length,
        reposterPubkeys: [...new Set(reposts.map((e) => e.pubkey))],
        comments: comments.length,
        commentEvents: comments.sort((a, b) => a.created_at - b.created_at),
        zapTotal,
        zapCount: zaps.length,
        zapEvents: zaps.sort((a, b) => b.created_at - a.created_at),
        events,
      };
    },
    enabled: Boolean(authorPubkey && slug),
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook to check if current user has liked an article
 */
export function useHasLiked(
  userPubkey: string | undefined,
  authorPubkey: string | undefined,
  slug: string | undefined
) {
  const { data: engagement } = useArticleEngagement(authorPubkey, slug);

  return useMemo(() => {
    if (!userPubkey || !engagement) return false;
    return engagement.likerPubkeys.includes(userPubkey);
  }, [userPubkey, engagement]);
}

/**
 * Hook to check if current user has reposted an article
 */
export function useHasReposted(
  userPubkey: string | undefined,
  authorPubkey: string | undefined,
  slug: string | undefined
) {
  const { data: engagement } = useArticleEngagement(authorPubkey, slug);

  return useMemo(() => {
    if (!userPubkey || !engagement) return false;
    return engagement.reposterPubkeys.includes(userPubkey);
  }, [userPubkey, engagement]);
}
