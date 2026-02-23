import { useMemo } from 'react';
import { useHead } from '@unhead/react';
import { Zap, Newspaper, Sparkles } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useArticles } from '@/hooks/useArticles';
import { ArticleGrid, ArticleGridSkeleton } from '@/components/blog/ArticleGrid';
import { CategoryNav } from '@/components/blog/CategoryNav';
import { extractCategories } from '@/lib/article';
import { Card, CardContent } from '@/components/ui/card';

export function HomePage() {
  const { user } = useCurrentUser();
  
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
    title: 'V4V Blog Builder - Your Nostr-Native Blog',
    meta: [
      { name: 'description', content: 'Create and share your content on Nostr with Lightning payments.' },
    ],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-28">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Powered by Nostr & Lightning</span>
            </div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-6 animate-fade-up">
              Your Content,{' '}
              <span className="text-primary">Your Rules</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              A beautiful blog platform built on Nostr. Own your content, 
              accept value-for-value payments, and connect directly with your audience.
            </p>

            {!user && (
              <div className="flex flex-wrap justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <Card className="flex-1 max-w-xs">
                  <CardContent className="pt-6 text-center">
                    <Zap className="h-10 w-10 mx-auto text-primary mb-4" />
                    <h3 className="font-heading text-lg mb-2">Lightning Zaps</h3>
                    <p className="text-sm text-muted-foreground">
                      Accept Bitcoin payments directly from your readers
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="flex-1 max-w-xs">
                  <CardContent className="pt-6 text-center">
                    <Newspaper className="h-10 w-10 mx-auto text-primary mb-4" />
                    <h3 className="font-heading text-lg mb-2">Own Your Content</h3>
                    <p className="text-sm text-muted-foreground">
                      Your posts live on Nostr, not a central server
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>
      </section>

      {/* Articles Section */}
      <section className="container py-12 md:py-16">
        {user ? (
          <>
            {/* Category Navigation */}
            {categories.length > 0 && (
              <div className="mb-8">
                <CategoryNav categories={categories} />
              </div>
            )}

            {/* Articles Grid */}
            {isLoading ? (
              <ArticleGridSkeleton count={6} />
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-destructive">Failed to load articles. Please try again.</p>
              </div>
            ) : articles && articles.length > 0 ? (
              <ArticleGrid articles={articles} />
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
