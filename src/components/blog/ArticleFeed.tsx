import { ArticleCard, ArticleCardSkeleton } from './ArticleCard';
import type { ArticleData } from '@/lib/article';
import { cn } from '@/lib/utils';

interface ArticleFeedProps {
  articles: ArticleData[];
  className?: string;
}

/**
 * Minimal article feed layout - just titles and dates
 */
export function ArticleFeed({ articles, className }: ArticleFeedProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No articles found.</p>
      </div>
    );
  }

  return (
    <div className={cn('divide-y', className)}>
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          layout="minimal"
          showThumbnail={false}
          showSummary={false}
        />
      ))}
    </div>
  );
}

export function ArticleFeedSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="divide-y">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} layout="minimal" />
      ))}
    </div>
  );
}
