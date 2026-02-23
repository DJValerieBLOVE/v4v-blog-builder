import { useState } from 'react';
import { Share2, Copy, Check, Twitter, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  url: string;
  title: string;
  summary?: string;
  variant?: 'default' | 'compact' | 'icon';
  className?: string;
}

export function ShareButton({
  url,
  title,
  summary,
  variant = 'default',
  className,
}: ShareButtonProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${url}`
    : url;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast({
        title: 'Link copied!',
        description: 'Article link copied to clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy link to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const handleShareTwitter = () => {
    const text = summary ? `${title}\n\n${summary}` : title;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fullUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const handleShareNostr = () => {
    // Create a nostr: URI for the article
    // This could be improved with nip19 encoding
    const nostrUrl = `nostr:${fullUrl}`;
    navigator.clipboard.writeText(nostrUrl).then(() => {
      toast({
        title: 'Nostr link copied!',
        description: 'Share this link in any Nostr client.',
      });
    });
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: summary ?? title,
          url: fullUrl,
        });
      } catch (error) {
        // User cancelled or share failed
        if ((error as Error).name !== 'AbortError') {
          toast({
            title: 'Share failed',
            description: 'Could not share the article.',
            variant: 'destructive',
          });
        }
      }
    } else {
      handleCopyLink();
    }
  };

  if (variant === 'icon') {
    return (
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn('h-9 w-9', className)}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Share</TooltipContent>
        </Tooltip>
        <ShareMenu
          onCopy={handleCopyLink}
          onTwitter={handleShareTwitter}
          onNativeShare={handleNativeShare}
          copied={copied}
        />
      </DropdownMenu>
    );
  }

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn('gap-1.5 h-8 px-2', className)}
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </DropdownMenuTrigger>
        <ShareMenu
          onCopy={handleCopyLink}
          onTwitter={handleShareTwitter}
          onNativeShare={handleNativeShare}
          copied={copied}
        />
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn('gap-2 rounded-full', className)}
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </DropdownMenuTrigger>
      <ShareMenu
        onCopy={handleCopyLink}
        onTwitter={handleShareTwitter}
        onNativeShare={handleNativeShare}
        copied={copied}
      />
    </DropdownMenu>
  );
}

interface ShareMenuProps {
  onCopy: () => void;
  onTwitter: () => void;
  onNativeShare: () => void;
  copied: boolean;
}

function ShareMenu({ onCopy, onTwitter, onNativeShare, copied }: ShareMenuProps) {
  const hasNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  return (
    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuItem onClick={onCopy}>
        {copied ? (
          <Check className="h-4 w-4 mr-2 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 mr-2" />
        )}
        {copied ? 'Copied!' : 'Copy link'}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onTwitter}>
        <Twitter className="h-4 w-4 mr-2" />
        Share on X
      </DropdownMenuItem>
      {hasNativeShare && (
        <DropdownMenuItem onClick={onNativeShare}>
          <Link2 className="h-4 w-4 mr-2" />
          More options...
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  );
}
