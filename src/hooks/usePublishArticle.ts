import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface ArticleInput {
  title: string;
  slug: string;
  content: string;
  summary?: string;
  image?: string;
  category?: string;
  tags?: string[];
  publishedAt?: number;
  featured?: boolean;
}

/**
 * Hook to publish an article (kind:30023)
 */
export function usePublishArticle() {
  const { user } = useCurrentUser();
  const { mutateAsync: createEvent } = useNostrPublish();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ArticleInput) => {
      if (!user) {
        throw new Error('Must be logged in to publish');
      }

      const {
        title,
        slug,
        content,
        summary,
        image,
        category,
        tags = [],
        publishedAt = Math.floor(Date.now() / 1000),
        featured = false,
      } = input;

      // Build tags array
      const eventTags: string[][] = [
        ['d', slug],
        ['title', title],
        ['published_at', String(publishedAt)],
      ];

      if (summary) {
        eventTags.push(['summary', summary]);
      }

      if (image) {
        eventTags.push(['image', image]);
      }

      if (category) {
        eventTags.push(['category', category]);
      }

      for (const tag of tags) {
        eventTags.push(['t', tag.toLowerCase()]);
      }

      // Add featured flag if set
      if (featured) {
        eventTags.push(['featured', 'true']);
      }

      // Add alt tag for NIP-31 compliance
      const altText = summary
        ? `Blog post: ${title} - ${summary}`
        : `Blog post: ${title}`;
      eventTags.push(['alt', altText]);

      // Create the article event
      await createEvent({
        kind: 30023,
        content,
        tags: eventTags,
      });

      return { slug, title };
    },
    onSuccess: () => {
      // Invalidate articles queries to refetch
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
}

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .slice(0, 100); // Limit length
}

/**
 * Validate article slug
 */
export function validateSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length > 0 && slug.length <= 100;
}
