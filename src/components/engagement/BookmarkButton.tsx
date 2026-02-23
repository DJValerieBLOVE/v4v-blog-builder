import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useToast } from '@/hooks/useToast';
import { useBookmarks, useToggleBookmark } from '@/hooks/useBookmarks';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  authorPubkey: string;
  slug: string;
  variant?: 'default' | 'compact' | 'icon';
  className?: string;
}

export function BookmarkButton({
  authorPubkey,
  slug,
  variant = 'default',
  className,
}: BookmarkButtonProps) {
  const { user } = useCurrentUser();
  const { toast } = useToast();
  const { data: bookmarks } = useBookmarks();
  const { mutateAsync: toggleBookmark, isPending } = useToggleBookmark();

  // Check if this article is bookmarked
  const aTag = `30023:${authorPubkey}:${slug}`;
  const isBookmarked = bookmarks?.some((b) => b === aTag) ?? false;

  const handleToggle = async () => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please log in to bookmark articles.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await toggleBookmark({ aTag, isCurrentlyBookmarked: isBookmarked });
      toast({
        title: isBookmarked ? 'Bookmark removed' : 'Article bookmarked!',
        description: isBookmarked
          ? 'Article removed from your bookmarks.'
          : 'Article saved to your bookmarks.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update bookmark. Please try again.',
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
            onClick={handleToggle}
            disabled={isPending}
            className={cn(
              'h-9 w-9',
              isBookmarked && 'text-primary',
              className
            )}
          >
            <Bookmark className={cn('h-5 w-5', isBookmarked && 'fill-current')} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
        </TooltipContent>
      </Tooltip>
    );
  }

  if (variant === 'compact') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        disabled={isPending}
        className={cn(
          'gap-1.5 h-8 px-2',
          isBookmarked && 'text-primary',
          className
        )}
      >
        <Bookmark className={cn('h-4 w-4', isBookmarked && 'fill-current')} />
        <span>{isBookmarked ? 'Saved' : 'Save'}</span>
      </Button>
    );
  }

  return (
    <Button
      variant={isBookmarked ? 'secondary' : 'outline'}
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        'gap-2 rounded-full',
        isBookmarked && 'text-primary border-primary/20 bg-primary/10 hover:bg-primary/20',
        className
      )}
    >
      <Bookmark className={cn('h-4 w-4', isBookmarked && 'fill-current')} />
      <span>{isBookmarked ? 'Saved' : 'Save'}</span>
    </Button>
  );
}
