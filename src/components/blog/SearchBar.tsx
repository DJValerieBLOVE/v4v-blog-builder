import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({
  initialQuery = '',
  placeholder = 'Search articles...',
  autoFocus = false,
  className,
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedQuery = query.trim();
      if (trimmedQuery) {
        if (onSearch) {
          onSearch(trimmedQuery);
        } else {
          navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
        }
      }
    },
    [query, navigate, onSearch]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  }, [onSearch]);

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-12 h-12 rounded-full text-base"
          autoFocus={autoFocus}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
    </form>
  );
}

interface SearchBoxProps {
  initialQuery?: string;
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

/**
 * Controlled search box for inline search functionality
 */
export function SearchBox({
  initialQuery = '',
  placeholder = 'Search...',
  onSearch,
  className,
}: SearchBoxProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="pl-10 rounded-full"
      />
    </div>
  );
}
