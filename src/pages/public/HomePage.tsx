import { useMemo } from 'react';
import { useHead } from '@unhead/react';
import { Zap, Newspaper } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useArticles } from '@/hooks/useArticles';
import { ArticleGrid, ArticleGridSkeleton } from '@/components/blog/ArticleGrid';
import { ArticleList, ArticleListSkeleton } from '@/components/blog/ArticleList';
import { ArticleFeed, ArticleFeedSkeleton } from '@/components/blog/ArticleFeed';
import { CategoryNav } from '@/components/blog/CategoryNav';
import { HeroSection } from '@/components/hero/HeroSection';
import { useBlogSettingsContext } from '@/components/theme/BlogSettingsProvider';
import { extractCategories } from '@/lib/article';
import { Card, CardContent } from '@/components/ui/card';

export function HomePage() {
  const { user } = useCurrentUser();
  const { settings } = useBlogSettingsContext();
  
  // When logged in, show the user's own articles
  // When logged out, show a curated feed or demo articles
  const { data: articles, isLoading, error } = useArticles({
    author: user?.pubkey,
    limit: 30,
  });

  // Extract categories from articles
  const categories = useMemo(() => {
    return articles ? extractCategories(articles) : [];
  }, [articles]);

  // Set page head
  useHead({
    title: `${settings.identity.blogName} - Your Nostr-Native Blog`,
    meta: [
      { name: 'description', content: settings.identity.tagline ?? 'Create and share your content on Nostr with Lightning payments.' },
    ],
  });

  // Determine layout based on theme preset
  const layout = settings.theme.preset;

  return (
    <div className="min-h-screen">
      {/* Hero Section - uses blog settings */}
      <HeroSection authorPubkey={user?.pubkey} />

      {/* Articles Section */}
      <section className="container py-12 md:py-16">
        {user ? (
          <>
            {/* Page Title for logged-in users */}
            <div className="mb-8">
              <h1 className="font-heading text-3xl md:text-4xl mb-2">
                {settings.identity.blogName}
              </h1>
              {settings.identity.tagline && (
                <p className="text-muted-foreground text-lg">
                  {settings.identity.tagline}
                </p>
              )}
            </div>

            {/* Category Navigation */}
            {categories.length > 0 && layout !== 'minimal' && (
              <div className="mb-8">
                <CategoryNav categories={categories} />
              </div>
            )}

            {/* Articles - Layout based on theme */}
            {isLoading ? (
              <ArticlesLoadingSkeleton layout={layout} />
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-destructive">Failed to load articles. Please try again.</p>
              </div>
            ) : articles && articles.length > 0 ? (
              <ArticlesDisplay articles={articles} layout={layout} />
            ) : (
              <EmptyState />
            )}
          </>
        ) : (
          <GettingStarted />
        )}
      </section>
    </div>
  );
}

function ArticlesDisplay({ 
  articles, 
  layout 
}: { 
  articles: import('@/lib/article').ArticleData[]; 
  layout: 'magazine' | 'newsletter' | 'minimal';
}) {
  if (layout === 'newsletter') {
    return <ArticleList articles={articles} />;
  }
  if (layout === 'minimal') {
    return (
      <div className="max-w-2xl mx-auto">
        <ArticleFeed articles={articles} />
      </div>
    );
  }
  // Magazine (default)
  return <ArticleGrid articles={articles} />;
}

function ArticlesLoadingSkeleton({ layout }: { layout: 'magazine' | 'newsletter' | 'minimal' }) {
  if (layout === 'newsletter') {
    return <ArticleListSkeleton count={5} />;
  }
  if (layout === 'minimal') {
    return (
      <div className="max-w-2xl mx-auto">
        <ArticleFeedSkeleton count={8} />
      </div>
    );
  }
  return <ArticleGridSkeleton count={6} />;
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="mx-auto max-w-md">
        <Newspaper className="h-16 w-16 mx-auto text-muted-foreground/50 mb-6" />
        <h2 className="font-heading text-2xl mb-4">No Articles Yet</h2>
        <p className="text-muted-foreground mb-6">
          You haven't published any articles yet. Head to the admin area to create your first post.
        </p>
        <a 
          href="/admin/editor" 
          className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Create Your First Article
        </a>
      </div>
    </div>
  );
}

function GettingStarted() {
  return (
    <div className="text-center py-16">
      <div className="mx-auto max-w-lg">
        <h2 className="font-heading text-3xl mb-6">Get Started</h2>
        <p className="text-muted-foreground mb-8">
          Log in with your Nostr account to start creating and viewing your articles. 
          Your content is stored on Nostr relays, giving you full ownership of your work.
        </p>
        
        <div className="grid gap-4 text-left">
          <div className="flex gap-4 p-4 rounded-lg bg-muted/50">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
              1
            </div>
            <div>
              <h3 className="font-medium mb-1">Connect Your Nostr Account</h3>
              <p className="text-sm text-muted-foreground">
                Use a browser extension like Alby or nos2x to log in securely.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 p-4 rounded-lg bg-muted/50">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
              2
            </div>
            <div>
              <h3 className="font-medium mb-1">Write Your Articles</h3>
              <p className="text-sm text-muted-foreground">
                Use our beautiful block editor to create engaging content.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 p-4 rounded-lg bg-muted/50">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
              3
            </div>
            <div>
              <h3 className="font-medium mb-1">Earn Bitcoin</h3>
              <p className="text-sm text-muted-foreground">
                Readers can zap your articles with Lightning payments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
