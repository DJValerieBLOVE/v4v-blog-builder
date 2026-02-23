import { Link } from 'react-router-dom';
import { useHead } from '@unhead/react';
import { Bookmark, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AdminBookmarks() {
  useHead({
    title: 'Bookmarks | V4V Blog Admin',
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl">Bookmarks</h1>
        <p className="text-muted-foreground">
          Articles you've saved for later
        </p>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="py-16">
          <div className="text-center">
            <Bookmark className="h-16 w-16 mx-auto text-muted-foreground/50 mb-6" />
            <h2 className="font-heading text-2xl mb-4">No Bookmarks Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Save articles to read later. Bookmark functionality uses Nostr's 
              NIP-51 lists, so your bookmarks sync across all Nostr clients.
            </p>
            <Button asChild className="rounded-full">
              <Link to="/">Browse Articles</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">How Bookmarks Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your bookmarks are stored on Nostr using NIP-51 (Lists). This means:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>Bookmarks sync across all your Nostr clients automatically</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>Your data is decentralized and owned by you</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>Public bookmarks can be seen by others, private ones are encrypted</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
