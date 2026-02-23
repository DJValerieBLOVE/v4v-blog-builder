import { Link } from 'react-router-dom';
import { nip19 } from 'nostr-tools';
import { Calendar, Clock, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthor } from '@/hooks/useAuthor';
import { formatDate, formatShortDate, calculateReadingTime, type ArticleData } from '@/lib/article';
import { cn } from '@/lib/utils';

interface ArticleMetaProps {
  article: ArticleData;
  showAuthor?: boolean;
  showDate?: boolean;
  showReadingTime?: boolean;
  variant?: 'default' | 'compact' | 'full';
  className?: string;
}

export function ArticleMeta({
  article,
  showAuthor = true,
  showDate = true,
  showReadingTime = true,
  variant = 'default',
  className,
}: ArticleMetaProps) {
  const author = useAuthor(article.pubkey);
  const npub = nip19.npubEncode(article.pubkey);
  const readingTime = calculateReadingTime(article.content);
  const metadata = author.data?.metadata;

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-3 text-sm text-muted-foreground', className)}>
        {showDate && <span>{formatShortDate(article.publishedAt)}</span>}
        {showReadingTime && (
          <>
            <span>•</span>
            <span>{readingTime} min</span>
          </>
        )}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={cn('flex flex-wrap items-center gap-6', className)}>
        {showAuthor && (
          <Link 
            to={`/${npub}`}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={metadata?.picture} alt={metadata?.name} />
              <AvatarFallback>
                {metadata?.name?.[0]?.toUpperCase() ?? '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm">{metadata?.name ?? 'Anonymous'}</p>
            </div>
          </Link>
        )}
        
        {showDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        )}
        
        {showReadingTime && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{readingTime} min read</span>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('flex items-center gap-4 text-sm text-muted-foreground', className)}>
      {showAuthor && metadata && (
        <Link 
          to={`/${npub}`}
          className="flex items-center gap-2 hover:text-foreground transition-colors"
        >
          <User className="h-4 w-4" />
          <span>{metadata.name}</span>
        </Link>
      )}
      
      {showDate && (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{formatShortDate(article.publishedAt)}</span>
        </div>
      )}
      
      {showReadingTime && (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{readingTime} min</span>
        </div>
      )}
    </div>
  );
}
