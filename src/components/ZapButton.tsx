import { ZapDialog } from '@/components/ZapDialog';
import { useZaps } from '@/hooks/useZaps';
import { useWallet } from '@/hooks/useWallet';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuthor } from '@/hooks/useAuthor';
import { Zap } from 'lucide-react';
import type { Event } from 'nostr-tools';

interface ZapButtonProps {
  target?: Event;
  event?: Event;
  className?: string;
  showCount?: boolean;
  zapData?: { count: number; totalSats: number; isLoading?: boolean };
  variant?: 'default' | 'compact';
}

export function ZapButton({
  target,
  event,
  className = "text-xs ml-1",
  showCount = true,
  zapData: externalZapData,
  variant: _variant = 'default',
}: ZapButtonProps) {
  // Support both target and event props for backwards compatibility
  const zapTarget = target ?? event;
  const { user } = useCurrentUser();
  const { data: author } = useAuthor(zapTarget?.pubkey || '');
  const { webln, activeNWC } = useWallet();

  // Only fetch data if not provided externally
  // Pass empty array to disable fetching when we don't need it
  const zapTargetForQuery = externalZapData || !zapTarget ? [] : [zapTarget];
  const { totalSats: fetchedTotalSats, isLoading } = useZaps(
    zapTargetForQuery,
    webln,
    activeNWC
  );

  // Don't show zap button if user is not logged in, is the author, or author has no lightning address
  if (!user || !zapTarget || user.pubkey === zapTarget.pubkey || (!author?.metadata?.lud16 && !author?.metadata?.lud06)) {
    return null;
  }

  // Use external data if provided, otherwise use fetched data
  const totalSats = externalZapData?.totalSats ?? fetchedTotalSats;
  const showLoading = externalZapData?.isLoading || isLoading;

  return (
    <ZapDialog target={zapTarget}>
      <div className={`flex items-center gap-1 ${className}`}>
        <Zap className="h-4 w-4" />
        <span className="text-xs">
          {showLoading ? (
            '...'
          ) : showCount && totalSats > 0 ? (
            `${totalSats.toLocaleString()}`
          ) : (
            'Zap'
          )}
        </span>
      </div>
    </ZapDialog>
  );
}