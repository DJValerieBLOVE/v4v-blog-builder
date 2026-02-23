import { nip19 } from 'nostr-tools';
import type { NostrEvent } from '@nostrify/nostrify';
import { Skeleton } from '@/components/ui/skeleton';
import { ZapButton } from '@/components/ZapButton';
import { ZapDisplay } from './ZapDisplay';
import { LikeButton } from './LikeButton';
import { RepostButton } from './RepostButton';
import { ShareButton } from './ShareButton';
import { BookmarkButton } from './BookmarkButton';
import { useArticleEngagement } from '@/hooks/useArticleEngagement';
import { cn } from '@/lib/utils';

interface EngagementBarProps {
  article: NostrEvent;
  authorPubkey: string;
  slug: string;
  title: string;
  summary?: string;
  layout?: 'horizontal' | 'vertical' | 'compact';
  showZapAmount?: boolean;
  showCommentCount?: boolean;
  showLikeCount?: boolean;
  showRepostCount?: boolean;
  className?: string;
}

export function EngagementBar({
  article,
  authorPubkey,
  slug,
  title,
  summary,
  layout = 'horizontal',
  showZapAmount = true,
  showLikeCount = true,
  showRepostCount = true,
  className,
}: EngagementBarProps) {
  const { data: engagement, isLoading } = useArticleEngagement(authorPubkey, slug);
  const npub = nip19.npubEncode(authorPubkey);
  const articleUrl = `/article/${npub}/${slug}`;

  if (isLoading) {
    return <EngagementBarSkeleton layout={layout} />;
  }

  if (layout === 'vertical') {
    return (
      <div className={cn('flex flex-col gap-4', className)}>
        {/* Zap Section */}
        <div className="space-y-3">
          <ZapButton event={article} />
          {showZapAmount && engagement && (
            <ZapDisplay
              zapTotal={engagement.zapTotal}
              zapCount={engagement.zapCount}
              zapEvents={engagement.zapEvents}
              showZappers
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <LikeButton
            authorPubkey={authorPubkey}
            slug={slug}
            articleId={article.id}
            likeCount={engagement?.likes ?? 0}
          />
          <RepostButton
            authorPubkey={authorPubkey}
            slug={slug}
            articleId={article.id}
            repostCount={engagement?.reposts ?? 0}
          />
          <ShareButton
            url={articleUrl}
            title={title}
            summary={summary}
          />
          <BookmarkButton
            authorPubkey={authorPubkey}
            slug={slug}
          />
        </div>
      </div>
    );
  }

  if (layout === 'compact') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <ZapButton event={article} variant="compact" />
        <LikeButton
          authorPubkey={authorPubkey}
          slug={slug}
          articleId={article.id}
          likeCount={engagement?.likes ?? 0}
          variant="compact"
        />
        <RepostButton
          authorPubkey={authorPubkey}
          slug={slug}
          articleId={article.id}
          repostCount={engagement?.reposts ?? 0}
          variant="compact"
        />
        <ShareButton
          url={articleUrl}
          title={title}
          summary={summary}
          variant="compact"
        />
        <BookmarkButton
          authorPubkey={authorPubkey}
          slug={slug}
          variant="compact"
        />
      </div>
    );
  }

  // Horizontal layout (default)
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4', className)}>
      {/* Left side - Zaps */}
      <div className="flex items-center gap-4">
        <ZapButton event={article} />
        {showZapAmount && engagement && (
          <ZapDisplay
            zapTotal={engagement.zapTotal}
            zapCount={engagement.zapCount}
            zapEvents={engagement.zapEvents}
            showZappers
            maxZappers={3}
          />
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <LikeButton
          authorPubkey={authorPubkey}
          slug={slug}
          articleId={article.id}
          likeCount={engagement?.likes ?? 0}
          variant="icon"
        />
        <RepostButton
          authorPubkey={authorPubkey}
          slug={slug}
          articleId={article.id}
          repostCount={engagement?.reposts ?? 0}
          variant="icon"
        />
        <ShareButton
          url={articleUrl}
          title={title}
          summary={summary}
          variant="icon"
        />
        <BookmarkButton
          authorPubkey={authorPubkey}
          slug={slug}
          variant="icon"
        />
      </div>
    </div>
  );
}

function EngagementBarSkeleton({ layout }: { layout: 'horizontal' | 'vertical' | 'compact' }) {
  if (layout === 'vertical') {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-full rounded-full" />
        <Skeleton className="h-6 w-32" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full rounded-full" />
          <Skeleton className="h-10 w-full rounded-full" />
          <Skeleton className="h-10 w-full rounded-full" />
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </div>
    );
  }

  if (layout === 'compact') {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-8 w-16" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-24 rounded-full" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-9 w-9 rounded" />
        ))}
      </div>
    </div>
  );
}
