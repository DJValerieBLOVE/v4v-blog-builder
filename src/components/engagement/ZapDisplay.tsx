import { useMemo } from 'react';
import { Zap } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthor } from '@/hooks/useAuthor';
import type { NostrEvent } from '@nostrify/nostrify';
import { cn } from '@/lib/utils';

interface ZapDisplayProps {
  zapTotal: number;
  zapCount: number;
  zapEvents: NostrEvent[];
  showTotal?: boolean;
  showZappers?: boolean;
  maxZappers?: number;
  className?: string;
}

export function ZapDisplay({
  zapTotal,
  zapCount,
  zapEvents,
  showTotal = true,
  showZappers = true,
  maxZappers = 5,
  className,
}: ZapDisplayProps) {
  // Get unique zapper pubkeys with their amounts
  const zappers = useMemo(() => {
    const zapperMap = new Map<string, number>();
    
    for (const zap of zapEvents) {
      // Get the sender pubkey from the description tag
      const descriptionTag = zap.tags.find(([name]) => name === 'description');
      if (descriptionTag) {
        try {
          const zapRequest = JSON.parse(descriptionTag[1]);
          const senderPubkey = zapRequest.pubkey;
          const amountTag = zap.tags.find(([name]) => name === 'amount');
          const amount = amountTag ? Math.floor(parseInt(amountTag[1], 10) / 1000) : 0;
          
          zapperMap.set(
            senderPubkey,
            (zapperMap.get(senderPubkey) ?? 0) + amount
          );
        } catch {
          // Invalid description JSON
        }
      }
    }

    // Sort by amount descending
    return Array.from(zapperMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxZappers)
      .map(([pubkey, amount]) => ({ pubkey, amount }));
  }, [zapEvents, maxZappers]);

  if (zapCount === 0) {
    return (
      <div className={cn('flex items-center gap-2 text-muted-foreground', className)}>
        <Zap className="h-4 w-4" />
        <span className="text-sm">0 sats</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Total amount */}
      {showTotal && (
        <div className="flex items-center gap-1.5 text-primary">
          <Zap className="h-5 w-5 fill-primary" />
          <span className="font-semibold">{formatSats(zapTotal)}</span>
        </div>
      )}

      {/* Zapper avatars */}
      {showZappers && zappers.length > 0 && (
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {zappers.map(({ pubkey, amount }) => (
              <ZapperAvatar key={pubkey} pubkey={pubkey} amount={amount} />
            ))}
          </div>
          {zapCount > maxZappers && (
            <span className="ml-2 text-sm text-muted-foreground">
              +{zapCount - maxZappers}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function ZapperAvatar({ pubkey, amount }: { pubkey: string; amount: number }) {
  const author = useAuthor(pubkey);
  const metadata = author.data?.metadata;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Avatar className="h-8 w-8 border-2 border-background cursor-pointer hover:z-10 transition-transform hover:scale-110">
          <AvatarImage src={metadata?.picture} />
          <AvatarFallback className="text-xs">
            {metadata?.name?.[0]?.toUpperCase() ?? '⚡'}
          </AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-center">
          <p className="font-medium">{metadata?.name ?? 'Anonymous'}</p>
          <p className="text-xs text-muted-foreground">{formatSats(amount)} zapped</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * Format sats with K/M suffixes
 */
function formatSats(sats: number): string {
  if (sats >= 1000000) {
    return `${(sats / 1000000).toFixed(1)}M sats`;
  }
  if (sats >= 1000) {
    return `${(sats / 1000).toFixed(1)}K sats`;
  }
  return `${sats} sats`;
}

export function ZapDisplaySkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-5 w-24" />
      <div className="flex -space-x-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}
