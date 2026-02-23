import type { ArticleData } from './article';
import type { NostrMetadata } from '@nostrify/nostrify';

/**
 * Generate JSON-LD structured data for an article
 */
export function generateArticleJsonLd(
  article: ArticleData,
  authorMetadata?: NostrMetadata,
  blogName?: string
): string {
  const publishedDate = new Date(article.publishedAt * 1000).toISOString();
  const modifiedDate = new Date(article.createdAt * 1000).toISOString();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary || article.title,
    image: article.image ?? undefined,
    author: {
      '@type': 'Person',
      name: authorMetadata?.name ?? 'Anonymous',
      url: authorMetadata?.website ?? undefined,
    },
    publisher: {
      '@type': 'Organization',
      name: blogName ?? 'V4V Blog',
      logo: undefined,
    },
    datePublished: publishedDate,
    dateModified: modifiedDate,
    keywords: article.tags.join(', '),
    articleSection: article.category ?? undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': typeof window !== 'undefined' ? window.location.href : '',
    },
  };

  return JSON.stringify(jsonLd);
}

/**
 * Generate JSON-LD for the blog homepage
 */
export function generateBlogJsonLd(
  blogName: string,
  description?: string,
  authorMetadata?: NostrMetadata
): string {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: blogName,
    description: description ?? `${blogName} - Powered by Nostr`,
    author: authorMetadata ? {
      '@type': 'Person',
      name: authorMetadata.name ?? 'Anonymous',
      url: authorMetadata.website ?? undefined,
      image: authorMetadata.picture ?? undefined,
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: blogName,
    },
  };

  return JSON.stringify(jsonLd);
}

/**
 * Generate JSON-LD for a person (author profile)
 */
export function generatePersonJsonLd(metadata: NostrMetadata): string {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: metadata.display_name ?? metadata.name ?? 'Anonymous',
    description: metadata.about ?? undefined,
    image: metadata.picture ?? undefined,
    url: metadata.website ?? undefined,
    sameAs: metadata.website ? [metadata.website] : undefined,
  };

  return JSON.stringify(jsonLd);
}
