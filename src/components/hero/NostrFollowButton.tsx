import { useState } from 'react';
import { nip19 } from 'nostr-tools';
import { UserPlus, Check, Copy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

interface NostrFollowButtonProps {
  authorPubkey?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function NostrFollowButton({
  authorPubkey,
  variant = 'default',
  size = 'default',
  className,
}: NostrFollowButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  if (!authorPubkey) {
    return null;
  }

  const npub = nip19.npubEncode(authorPubkey);

  const handleCopyNpub = async () => {
    try {
      await navigator.clipboard.writeText(npub);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Nostr address copied to clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Failed to copy',
        variant: 'destructive',
      });
    }
  };

  const handleOpenNostrClient = () => {
    // Try to open in a Nostr client via nostr: URI scheme
    window.open(`nostr:${npub}`, '_blank');
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setDialogOpen(true)}
        className={cn('gap-2 rounded-full', className)}
      >
        <UserPlus className="h-4 w-4" />
        Follow on Nostr
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Follow on Nostr</DialogTitle>
            <DialogDescription>
              Copy this address to follow in your favorite Nostr client.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Npub display */}
            <div className="flex items-center gap-2">
              <Input
                value={npub}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyNpub}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleOpenNostrClient}
                className="w-full rounded-full gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Open in Nostr Client
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Or paste the address in any Nostr app like Damus, Primal, or Amethyst
              </p>
            </div>

            {/* Popular clients */}
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-3">Popular Nostr Clients</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <a
                  href="https://damus.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  Damus (iOS)
                </a>
                <a
                  href="https://primal.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  Primal (Web)
                </a>
                <a
                  href="https://snort.social"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  Snort (Web)
                </a>
                <a
                  href="https://github.com/greenart7c3/Amethyst"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  Amethyst (Android)
                </a>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
