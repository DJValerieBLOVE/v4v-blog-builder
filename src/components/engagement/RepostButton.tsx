import { useState } from 'react';
import { Repeat2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useHasReposted } from '@/hooks/useArticleEngagement';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

interface RepostButtonProps {
  authorPubkey: string;
  slug: string;
  articleId: string;
  repostCount: number;
  variant?: 'default' | 'compact' | 'icon';
  className?: string;
}

export function RepostButton({
  authorPubkey,
  slug,
  articleId,
  repostCount,
  variant = 'default',
  className,
}: RepostButtonProps) {
  const { user } = useCurrentUser();
  const { toast } = useToast();
  const { mutateAsync: createEvent, isPending } = useNostrPublish();
  const hasReposted = useHasReposted(user?.pubkey, authorPubkey, slug);
  const [optimisticReposted, setOptimisticReposted] = useState(false);

  const isReposted = hasReposted || optimisticReposted;
  const displayCount = repostCount + (optimisticReposted && !hasReposted ? 1 : 0);

  const handleRepost = async () => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please log in to repost articles.',
        variant: 'destructive',
      });
      return;
    }

    if (isReposted) {
      toast({
        title: 'Already reposted',
        description: 'You have already reposted this article.',
      });
      return;
    }

    // Optimistic update
    setOptimisticReposted(true);

    try {
      // Use kind 16 (generic repost) for long-form content
      await createEvent({
        kind: 16,
        content: '',
        tags: [
          ['a', `30023:${authorPubkey}:${slug}`],
          ['e', articleId],
          ['p', authorPubkey],
          ['k', '30023'],
        ],
      });

      toast({
        title: 'Reposted!',
        description: 'Article shared to your followers.',
      });
    } catch (error) {
      setOptimisticReposted(false);
      toast({
        title: 'Error',
        description: 'Failed to repost article. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (variant === 'icon') {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRepost}
            disabled={isPending}
            className={cn(
              'h-9 w-9',
              isReposted && 'text-green-500 hover:text-green-600',
              className
            )}
          >
            <Repeat2 className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isReposted ? 'Reposted' : 'Repost this article'}
        </TooltipContent>
      </Tooltip>
    );
  }

  if (variant === 'compact') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRepost}
        disabled={isPending}
        className={cn(
          'gap-1.5 h-8 px-2',
          isReposted && 'text-green-500 hover:text-green-600',
          className
        )}
      >
        <Repeat2 className="h-4 w-4" />
        <span>{displayCount}</span>
      </Button>
    );
  }

  return (
    <Button
      variant={isReposted ? 'secondary' : 'outline'}
      onClick={handleRepost}
      disabled={isPending}
      className={cn(
        'gap-2 rounded-full',
        isReposted && 'text-green-500 border-green-200 bg-green-50 hover:bg-green-100 dark:border-green-900 dark:bg-green-950 dark:hover:bg-green-900',
        className
      )}
    >
      <Repeat2 className="h-4 w-4" />
      <span>{displayCount} {displayCount === 1 ? 'Repost' : 'Reposts'}</span>
    </Button>
  );
}
