import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import type { NostrEvent, NostrFilter } from '@nostrify/nostrify';
import { parseArticle, validateArticle, sortArticlesByDate, type ArticleData } from '@/lib/article';

interface UseArticlesOptions {
  /** Filter by author pubkey */
  author?: string;
  /** Filter by category */
  category?: string;
  /** Filter by tag */
  tag?: string;
  /** Maximum number of articles to fetch */
  limit?: number;
  /** Enable the query */
  enabled?: boolean;
}

/**
 * Hook to fetch published articles (kind:30023)
 */
export function useArticles(options: UseArticlesOptions = {}) {
  const { author, category, tag, limit = 50, enabled = true } = options;
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['articles', { author, category, tag, limit }],
    queryFn: async (): Promise<ArticleData[]> => {
      const filter: NostrFilter = {
        kinds: [30023],
        limit,
      };

      // Add author filter if specified
      if (author) {
        filter.authors = [author];
      }

      // Add tag filter if specified
      if (tag) {
        filter['#t'] = [tag];
      }

      const events = await nostr.query([filter]);

      // Validate and parse events
      const articles = events
        .filter(validateArticle)
        .map(parseArticle);

      // Filter by category if specified (client-side since category is not indexed)
      const filteredArticles = category
        ? articles.filter((a) => a.category?.toLowerCase() === category.toLowerCase())
        : articles;

      // Sort by published date, newest first
      return sortArticlesByDate(filteredArticles);
    },
    enabled,
  });
}

/**
 * Hook to fetch a single article by author and slug
 */
export function useArticle(authorPubkey: string | undefined, slug: string | undefined) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['article', authorPubkey, slug],
    queryFn: async (): Promise<ArticleData | null> => {
      if (!authorPubkey || !slug) return null;

      const events = await nostr.query([
        {
          kinds: [30023],
          authors: [authorPubkey],
          '#d': [slug],
          limit: 1,
        },
      ]);

      const event = events[0];
      if (!event || !validateArticle(event)) {
        return null;
      }

      return parseArticle(event);
    },
    enabled: Boolean(authorPubkey && slug),
  });
}

/**
 * Hook to search articles
 */
export function useSearchArticles(query: string, author?: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['articles', 'search', query, author],
    queryFn: async (): Promise<ArticleData[]> => {
      if (!query.trim()) return [];

      // Since Nostr doesn't have built-in full-text search,
      // we fetch recent articles and filter client-side
      const filter: NostrFilter = {
        kinds: [30023],
        limit: 100,
      };

      if (author) {
        filter.authors = [author];
      }

      const events = await nostr.query([filter]);

      const articles = events.filter(validateArticle).map(parseArticle);

      // Client-side search
      const lowerQuery = query.toLowerCase();
      const searchResults = articles.filter((article) => {
        const searchableText = [
          article.title,
          article.summary,
          article.content,
          article.category,
          ...article.tags,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return searchableText.includes(lowerQuery);
      });

      return sortArticlesByDate(searchResults);
    },
    enabled: query.trim().length > 0,
  });
}
