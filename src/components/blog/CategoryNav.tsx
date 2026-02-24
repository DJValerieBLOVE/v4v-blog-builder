import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface CategoryNavProps {
  categories: string[];
  activeCategory?: string;
  showAll?: boolean;
  className?: string;
}

export function CategoryNav({ 
  categories, 
  activeCategory, 
  showAll = true,
  className 
}: CategoryNavProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  if (categories.length === 0) {
    return null;
  }

  return (
    <ScrollArea className={cn('w-full whitespace-nowrap', className)}>
      <div className="flex items-center gap-2 pb-2">
        {showAll && (
          <Button
            variant={isHome && !activeCategory ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            asChild
          >
            <Link to="/">All</Link>
          </Button>
        )}
        
        {categories.map((category) => {
          const categorySlug = category.toLowerCase();
          const isActive = activeCategory?.toLowerCase() === categorySlug;
          
          return (
            <Button
              key={category}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              className="rounded-full"
              asChild
            >
              <Link to={`/category/${categorySlug}`}>{category}</Link>
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

interface TagCloudProps {
  tags: Map<string, number>;
  activeTag?: string;
  maxTags?: number;
  className?: string;
}

export function TagCloud({ 
  tags, 
  activeTag, 
  maxTags = 20,
  className 
}: TagCloudProps) {
  // Sort tags by count and take top N
  const sortedTags = Array.from(tags.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxTags);

  if (sortedTags.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {sortedTags.map(([tag, count]) => {
        const isActive = activeTag === tag;
        
        return (
          <Link
            key={tag}
            to={`/tag/${tag}`}
            className={cn(
              'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'border bg-background hover:bg-primary/10 hover:text-primary'
            )}
          >
            <span>#{tag}</span>
            <span className="text-xs opacity-70">({count})</span>
          </Link>
        );
      })}
    </div>
  );
}
