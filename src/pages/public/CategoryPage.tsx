import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useHead } from '@unhead/react';
import { ArrowLeft, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useArticles } from '@/hooks/useArticles';
import { ArticleGrid, ArticleGridSkeleton } from '@/components/blog/ArticleGrid';
import { CategoryNav } from '@/components/blog/CategoryNav';
import { extractCategories } from '@/lib/article';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useCurrentUser();

  // Fetch all articles to get categories list, then filter by category
  const { data: allArticles, isLoading } = useArticles({
    author: user?.pubkey,
    limit: 100,
  });

  // Filter articles by category
  const articles = useMemo(() => {
    if (!allArticles || !slug) return [];
    return allArticles.filter(
      (a) => a.category?.toLowerCase() === slug.toLowerCase()
    );
  }, [allArticles, slug]);

  // Get all categories for navigation
  const categories = useMemo(() => {
    return allArticles ? extractCategories(allArticles) : [];
  }, [allArticles]);

  // Get display name for category (proper case)
  const categoryName = useMemo(() => {
    if (!articles.length) return slug;
    return articles[0]?.category ?? slug;
  }, [articles, slug]);

  // Set page head
  useHead({
    title: `${categoryName} | V4V Blog`,
    meta: [
      { name: 'description', content: `Articles in the ${categoryName} category` },
    ],
  });

  return (
    <div className="container py-12">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="gap-2 -ml-4">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            All Articles
          </Link>
        </Button>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FolderOpen className="h-8 w-8 text-primary" />
          <h1 className="font-heading text-3xl md:text-4xl">{categoryName}</h1>
        </div>
        <p className="text-muted-foreground">
          {articles.length} {articles.length === 1 ? 'article' : 'articles'} in this category
        </p>
      </div>

      {/* Category Navigation */}
      {categories.length > 0 && (
        <div className="mb-8">
          <CategoryNav categories={categories} activeCategory={slug} />
        </div>
      )}

      {/* Articles Grid */}
      {isLoading ? (
        <ArticleGridSkeleton count={6} />
      ) : articles.length > 0 ? (
        <ArticleGrid articles={articles} />
      ) : (
        <EmptyCategory categoryName={categoryName ?? 'this category'} />
      )}
    </div>
  );
}

function EmptyCategory({ categoryName }: { categoryName: string }) {
  return (
    <div className="text-center py-16">
      <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-6" />
      <h2 className="font-heading text-2xl mb-4">No Articles Found</h2>
      <p className="text-muted-foreground mb-6">
        There are no articles in the "{categoryName}" category yet.
      </p>
      <Button asChild className="rounded-full">
        <Link to="/">Browse All Articles</Link>
      </Button>
    </div>
  );
}
