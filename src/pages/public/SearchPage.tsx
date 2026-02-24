import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useHead } from '@unhead/react';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSearchArticles } from '@/hooks/useArticles';
import { ArticleList, ArticleListSkeleton } from '@/components/blog/ArticleList';
import { SearchBar } from '@/components/blog/SearchBar';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const { user } = useCurrentUser();

  // Search articles
  const { data: articles, isLoading, isFetching } = useSearchArticles(
    query,
    user?.pubkey
  );

  // Update URL when query changes
  useEffect(() => {
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  }, [query, setSearchParams]);

  // Sync with URL on mount
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Set page head
  useHead({
    title: query ? `Search: "${query}" | V4V Blog` : 'Search | V4V Blog',
    meta: [
      { name: 'description', content: 'Search articles on V4V Blog' },
    ],
  });

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
  };

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
        <h1 className="font-heading text-3xl md:text-4xl mb-6">Search Articles</h1>
        <SearchBar
          initialQuery={query}
          onSearch={handleSearch}
          autoFocus
          className="max-w-xl"
        />
      </div>

      {/* Results */}
      {!query ? (
        <SearchPrompt />
      ) : isLoading || isFetching ? (
        <ArticleListSkeleton count={5} />
      ) : articles && articles.length > 0 ? (
        <div>
          <p className="text-muted-foreground mb-6">
            Found {articles.length} {articles.length === 1 ? 'result' : 'results'} for "{query}"
          </p>
          <ArticleList articles={articles} />
        </div>
      ) : (
        <NoResults query={query} />
      )}
    </div>
  );
}

function SearchPrompt() {
  return (
    <div className="text-center py-16">
      <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-6" />
      <h2 className="font-heading text-2xl mb-4">Start Searching</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        Enter a search term to find articles by title, content, tags, or category.
      </p>
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="text-center py-16">
      <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-6" />
      <h2 className="font-heading text-2xl mb-4">No Results Found</h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        We couldn't find any articles matching "{query}". Try different keywords or browse all articles.
      </p>
      <Button asChild className="rounded-full">
        <Link to="/">Browse All Articles</Link>
      </Button>
    </div>
  );
}
