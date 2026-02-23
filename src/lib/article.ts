import type { NostrEvent } from '@nostrify/nostrify';

/**
 * Extract article metadata from a NIP-23 kind:30023 event
 */
export interface ArticleData {
  id: string;
  pubkey: string;
  slug: string;
  title: string;
  summary: string;
  image: string | null;
  content: string;
  publishedAt: number;
  createdAt: number;
  category: string | null;
  tags: string[];
  featured: boolean;
  event: NostrEvent;
}

/**
 * Parse a kind:30023 event into ArticleData
 */
export function parseArticle(event: NostrEvent): ArticleData {
  const slug = event.tags.find(([name]) => name === 'd')?.[1] ?? '';
  const title = event.tags.find(([name]) => name === 'title')?.[1] ?? 'Untitled';
  const summary = event.tags.find(([name]) => name === 'summary')?.[1] ?? '';
  const image = event.tags.find(([name]) => name === 'image')?.[1] ?? null;
  const publishedAtStr = event.tags.find(([name]) => name === 'published_at')?.[1];
  const publishedAt = publishedAtStr ? parseInt(publishedAtStr, 10) : event.created_at;
  const category = event.tags.find(([name]) => name === 'category')?.[1] ?? null;
  const tags = event.tags
    .filter(([name]) => name === 't')
    .map(([, value]) => value);
  const featured = event.tags.find(([name]) => name === 'featured')?.[1] === 'true';

  return {
    id: event.id,
    pubkey: event.pubkey,
    slug,
    title,
    summary,
    image,
    content: event.content,
    publishedAt,
    createdAt: event.created_at,
    category,
    tags,
    featured,
    event,
  };
}

/**
 * Validate that a kind:30023 event has the required fields
 */
export function validateArticle(event: NostrEvent): boolean {
  if (event.kind !== 30023) return false;
  
  const slug = event.tags.find(([name]) => name === 'd')?.[1];
  const title = event.tags.find(([name]) => name === 'title')?.[1];
  
  // Required: d-tag (slug) and title
  return Boolean(slug && title);
}

/**
 * Format a Unix timestamp to a readable date
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a Unix timestamp to a short date
 */
export function formatShortDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Calculate estimated reading time from content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Generate article URL
 */
export function getArticleUrl(pubkey: string, slug: string): string {
  // Use nip19 to encode pubkey as npub
  const { nip19 } = require('nostr-tools');
  const npub = nip19.npubEncode(pubkey);
  return `/article/${npub}/${slug}`;
}

/**
 * Extract unique categories from articles
 */
export function extractCategories(articles: ArticleData[]): string[] {
  const categories = new Set<string>();
  for (const article of articles) {
    if (article.category) {
      categories.add(article.category);
    }
  }
  return Array.from(categories).sort();
}

/**
 * Extract unique tags from articles with counts
 */
export function extractTagCounts(articles: ArticleData[]): Map<string, number> {
  const tagCounts = new Map<string, number>();
  for (const article of articles) {
    for (const tag of article.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }
  return tagCounts;
}

/**
 * Sort articles by published date (newest first)
 */
export function sortArticlesByDate(articles: ArticleData[]): ArticleData[] {
  return [...articles].sort((a, b) => b.publishedAt - a.publishedAt);
}

/**
 * Search articles by query string
 */
export function searchArticles(articles: ArticleData[], query: string): ArticleData[] {
  const lowerQuery = query.toLowerCase();
  return articles.filter((article) => {
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
}
