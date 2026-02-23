import { ArticleCard, ArticleCardSkeleton } from './ArticleCard';
import type { ArticleData } from '@/lib/article';
import { cn } from '@/lib/utils';

interface ArticleListProps {
  articles: ArticleData[];
  showAuthor?: boolean;
  className?: string;
}

export function ArticleList({ articles, showAuthor = false, className }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No articles found.</p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          layout="list"
          showAuthor={showAuthor}
        />
      ))}
    </div>
  );
}

export function ArticleListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} layout="list" />
      ))}
    </div>
  );
}
