import { ArticleCard, ArticleCardSkeleton } from './ArticleCard';
import type { ArticleData } from '@/lib/article';
import { cn } from '@/lib/utils';

interface ArticleGridProps {
  articles: ArticleData[];
  showAuthor?: boolean;
  className?: string;
}

export function ArticleGrid({ articles, showAuthor = false, className }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No articles found.</p>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          layout="grid"
          showAuthor={showAuthor}
        />
      ))}
    </div>
  );
}

export function ArticleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} layout="grid" />
      ))}
    </div>
  );
}
