import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { useHasLiked } from '@/hooks/useArticleEngagement';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  authorPubkey: string;
  slug: string;
  articleId: string;
  likeCount: number;
  variant?: 'default' | 'compact' | 'icon';
  className?: string;
}

export function LikeButton({
  authorPubkey,
  slug,
  articleId,
  likeCount,
  variant = 'default',
  className,
}: LikeButtonProps) {
  const { user } = useCurrentUser();
  const { toast } = useToast();
  const { mutateAsync: createEvent, isPending } = useNostrPublish();
  const hasLiked = useHasLiked(user?.pubkey, authorPubkey, slug);
  const [optimisticLiked, setOptimisticLiked] = useState(false);

  const isLiked = hasLiked || optimisticLiked;
  const displayCount = likeCount + (optimisticLiked && !hasLiked ? 1 : 0);

  const handleLike = async () => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please log in to like articles.',
        variant: 'destructive',
      });
      return;
    }

    if (isLiked) {
      toast({
        title: 'Already liked',
        description: 'You have already liked this article.',
      });
      return;
    }

    // Optimistic update
    setOptimisticLiked(true);

    try {
      await createEvent({
        kind: 7,
        content: '+',
        tags: [
          ['a', `30023:${authorPubkey}:${slug}`],
          ['e', articleId],
          ['p', authorPubkey],
          ['k', '30023'],
        ],
      });

      toast({
        title: 'Liked!',
        description: 'You liked this article.',
      });
    } catch (error) {
      setOptimisticLiked(false);
      toast({
        title: 'Error',
        description: 'Failed to like article. Please try again.',
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
            onClick={handleLike}
            disabled={isPending}
            className={cn(
              'h-9 w-9',
              isLiked && 'text-red-500 hover:text-red-600',
              className
            )}
          >
            <Heart className={cn('h-5 w-5', isLiked && 'fill-current')} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isLiked ? 'Liked' : 'Like this article'}
        </TooltipContent>
      </Tooltip>
    );
  }

  if (variant === 'compact') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={isPending}
        className={cn(
          'gap-1.5 h-8 px-2',
          isLiked && 'text-red-500 hover:text-red-600',
          className
        )}
      >
        <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
        <span>{displayCount}</span>
      </Button>
    );
  }

  return (
    <Button
      variant={isLiked ? 'secondary' : 'outline'}
      onClick={handleLike}
      disabled={isPending}
      className={cn(
        'gap-2 rounded-full',
        isLiked && 'text-red-500 border-red-200 bg-red-50 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:hover:bg-red-900',
        className
      )}
    >
      <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
      <span>{displayCount} {displayCount === 1 ? 'Like' : 'Likes'}</span>
    </Button>
  );
}
