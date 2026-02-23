import { useParams, Link } from 'react-router-dom';
import { useHead } from '@unhead/react';
import { ArrowLeft, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useArticles } from '@/hooks/useArticles';
import { ArticleGrid, ArticleGridSkeleton } from '@/components/blog/ArticleGrid';

export function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const { user } = useCurrentUser();

  // Fetch articles with this tag
  const { data: articles, isLoading } = useArticles({
    author: user?.pubkey,
    tag: tag,
    limit: 50,
  });

  // Set page head
  useHead({
    title: `#${tag} | V4V Blog`,
    meta: [
      { name: 'description', content: `Articles tagged with #${tag}` },
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
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
            <Hash className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl">#{tag}</h1>
        </div>
        <p className="text-muted-foreground">
          {articles?.length ?? 0} {(articles?.length ?? 0) === 1 ? 'article' : 'articles'} with this tag
        </p>
      </div>

      {/* Articles Grid */}
      {isLoading ? (
        <ArticleGridSkeleton count={6} />
      ) : articles && articles.length > 0 ? (
        <ArticleGrid articles={articles} />
      ) : (
        <EmptyTag tagName={tag ?? 'this tag'} />
      )}
    </div>
  );
}

function EmptyTag({ tagName }: { tagName: string }) {
  return (
    <div className="text-center py-16">
      <Hash className="h-16 w-16 mx-auto text-muted-foreground/50 mb-6" />
      <h2 className="font-heading text-2xl mb-4">No Articles Found</h2>
      <p className="text-muted-foreground mb-6">
        There are no articles tagged with "#{tagName}" yet.
      </p>
      <Button asChild className="rounded-full">
        <Link to="/">Browse All Articles</Link>
      </Button>
    </div>
  );
}
