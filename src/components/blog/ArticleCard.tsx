import { Link } from 'react-router-dom';
import { nip19 } from 'nostr-tools';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthor } from '@/hooks/useAuthor';
import { formatShortDate, calculateReadingTime, type ArticleData } from '@/lib/article';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: ArticleData;
  layout?: 'grid' | 'list' | 'minimal';
  showThumbnail?: boolean;
  showSummary?: boolean;
  showMeta?: boolean;
  showAuthor?: boolean;
  className?: string;
}

export function ArticleCard({
  article,
  layout = 'grid',
  showThumbnail = true,
  showSummary = true,
  showMeta = true,
  showAuthor = false,
  className,
}: ArticleCardProps) {
  const npub = nip19.npubEncode(article.pubkey);
  const articleUrl = `/article/${npub}/${article.slug}`;
  const author = useAuthor(article.pubkey);
  const readingTime = calculateReadingTime(article.content);

  // Default placeholder image for articles without thumbnails
  const placeholderImage = `https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop`;

  if (layout === 'minimal') {
    return (
      <Link to={articleUrl} className={cn('group block', className)}>
        <article className="py-4 border-b last:border-b-0">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-heading text-lg group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              {showMeta && (
                <p className="text-sm text-muted-foreground mt-1">
                  {formatShortDate(article.publishedAt)}
                </p>
              )}
            </div>
            {article.category && (
              <Badge variant="secondary" className="shrink-0">
                {article.category}
              </Badge>
            )}
          </div>
        </article>
      </Link>
    );
  }

  if (layout === 'list') {
    return (
      <Link to={articleUrl} className={cn('group block', className)}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row">
            {showThumbnail && (
              <div className="sm:w-64 shrink-0">
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={article.image ?? placeholderImage}
                    alt={article.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </AspectRatio>
              </div>
            )}
            <CardContent className="flex-1 p-6">
              {article.category && (
                <Badge variant="secondary" className="mb-3">
                  {article.category}
                </Badge>
              )}
              <h3 className="font-heading text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              {showSummary && article.summary && (
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {article.summary}
                </p>
              )}
              {showMeta && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {showAuthor && author.data?.metadata && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={author.data.metadata.picture} />
                        <AvatarFallback className="text-xs">
                          {author.data.metadata.name?.[0]?.toUpperCase() ?? '?'}
                        </AvatarFallback>
                      </Avatar>
                      <span>{author.data.metadata.name}</span>
                    </div>
                  )}
                  <span>{formatShortDate(article.publishedAt)}</span>
                  <span>{readingTime} min read</span>
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  // Grid layout (default)
  return (
    <Link to={articleUrl} className={cn('group block', className)}>
      <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
        {showThumbnail && (
          <AspectRatio ratio={16 / 9}>
            <img
              src={article.image ?? placeholderImage}
              alt={article.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          </AspectRatio>
        )}
        <CardContent className="p-6">
          {article.category && (
            <Badge variant="secondary" className="mb-3">
              {article.category}
            </Badge>
          )}
          <h3 className="font-heading text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          {showSummary && article.summary && (
            <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
              {article.summary}
            </p>
          )}
          {showMeta && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{formatShortDate(article.publishedAt)}</span>
              <span>{readingTime} min read</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export function ArticleCardSkeleton({ layout = 'grid' }: { layout?: 'grid' | 'list' | 'minimal' }) {
  if (layout === 'minimal') {
    return (
      <div className="py-4 border-b">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-64 shrink-0">
            <AspectRatio ratio={16 / 9}>
              <Skeleton className="w-full h-full" />
            </AspectRatio>
          </div>
          <CardContent className="flex-1 p-6">
            <Skeleton className="h-5 w-20 mb-3" />
            <Skeleton className="h-7 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <Skeleton className="h-4 w-40" />
          </CardContent>
        </div>
      </Card>
    );
  }

  // Grid skeleton
  return (
    <Card className="overflow-hidden">
      <AspectRatio ratio={16 / 9}>
        <Skeleton className="w-full h-full" />
      </AspectRatio>
      <CardContent className="p-6">
        <Skeleton className="h-5 w-20 mb-3" />
        <Skeleton className="h-7 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
