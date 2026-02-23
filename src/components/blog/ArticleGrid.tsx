import { ArticleCard, ArticleCardSkeleton } from './ArticleCard';
import type { ArticleData } from '@/lib/article';
import { cn } from '@/lib/utils';

interface ArticleGridProps {
  articles: ArticleData[];
  showAuthor?: boolean;
  showFeatured?: boolean;
  className?: string;
}

export function ArticleGrid({ articles, showAuthor = false, showFeatured = true, className }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No articles found.</p>
      </div>
    );
  }

  // Split first article as featured (if enabled and we have articles)
  const featuredArticle = showFeatured && articles.length > 0 ? articles[0] : null;
  const remainingArticles = showFeatured ? articles.slice(1) : articles;

  return (
    <div className={cn('space-y-8', className)}>
      {/* Featured Article - large hero card */}
      {featuredArticle && (
        <ArticleCard
          article={featuredArticle}
          layout="featured"
          showAuthor={showAuthor}
        />
      )}

      {/* Rest of articles in grid */}
      {remainingArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remainingArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              layout="grid"
              showAuthor={showAuthor}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ArticleGridSkeleton({ count = 6, showFeatured = true }: { count?: number; showFeatured?: boolean }) {
  const gridCount = showFeatured ? Math.max(0, count - 1) : count;

  return (
    <div className="space-y-8">
      {/* Featured skeleton */}
      {showFeatured && <ArticleCardSkeleton layout="featured" />}

      {/* Grid skeletons */}
      {gridCount > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: gridCount }).map((_, i) => (
            <ArticleCardSkeleton key={i} layout="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
