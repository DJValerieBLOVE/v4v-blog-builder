import { useParams } from 'react-router-dom';
import { nip19 } from 'nostr-tools';
import { useHead } from '@unhead/react';
import { useArticle } from '@/hooks/useArticles';
import { useAuthor } from '@/hooks/useAuthor';
import { useBlogSettingsContext } from '@/components/theme/BlogSettingsProvider';
import { ArticleView, ArticleViewSkeleton } from '@/components/blog/ArticleView';
import { generateArticleJsonLd } from '@/lib/seo';
import NotFound from '@/pages/NotFound';

export function ArticlePage() {
  const { npub, slug } = useParams<{ npub: string; slug: string }>();
  const { settings } = useBlogSettingsContext();

  // Decode npub to get pubkey
  let authorPubkey: string | undefined;
  try {
    if (npub) {
      const decoded = nip19.decode(npub);
      if (decoded.type === 'npub') {
        authorPubkey = decoded.data;
      }
    }
  } catch {
    // Invalid npub format
  }

  const { data: article, isLoading, error } = useArticle(authorPubkey, slug);
  const author = useAuthor(authorPubkey);
  const authorMetadata = author.data?.metadata;
  const blogName = settings.identity.blogName;

  // Generate JSON-LD for SEO
  const jsonLd = article
    ? generateArticleJsonLd(article, authorMetadata, blogName)
    : '';

  // Set page head based on article data
  useHead({
    title: article ? `${article.title} | ${blogName}` : `Loading... | ${blogName}`,
    meta: article ? [
      { name: 'description', content: article.summary || article.title },
      { name: 'author', content: authorMetadata?.name ?? 'Anonymous' },
      { name: 'keywords', content: article.tags.join(', ') },
      // Open Graph
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: article.title },
      { property: 'og:description', content: article.summary || article.title },
      ...(article.image ? [{ property: 'og:image', content: article.image }] : []),
      { property: 'og:site_name', content: blogName },
      { property: 'article:published_time', content: new Date(article.publishedAt * 1000).toISOString() },
      { property: 'article:author', content: authorMetadata?.name ?? 'Anonymous' },
      ...(article.tags.map(tag => ({ property: 'article:tag', content: tag }))),
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: article.title },
      { name: 'twitter:description', content: article.summary || article.title },
      ...(article.image ? [{ name: 'twitter:image', content: article.image }] : []),
    ] : [],
    script: article ? [
      {
        type: 'application/ld+json',
        children: jsonLd,
      },
    ] : [],
  });

  // Invalid npub
  if (!authorPubkey || !slug) {
    return <NotFound />;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-12">
        <ArticleViewSkeleton />
      </div>
    );
  }

  // Error or not found
  if (error || !article) {
    return <NotFound />;
  }

  return (
    <div className="container py-12">
      <ArticleView article={article} />
    </div>
  );
}
