import { useHead } from '@unhead/react';
import { nip19 } from 'nostr-tools';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Zap, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuthor } from '@/hooks/useAuthor';

export function AboutPage() {
  const { user } = useCurrentUser();
  const author = useAuthor(user?.pubkey);
  const metadata = author.data?.metadata;

  // Set page head
  useHead({
    title: metadata?.name ? `About ${metadata.name} | V4V Blog` : 'About | V4V Blog',
    meta: [
      { name: 'description', content: metadata?.about ?? 'About the author' },
    ],
  });

  // Not logged in
  if (!user) {
    return (
      <div className="container py-12">
        <div className="mb-6">
          <Button variant="ghost" asChild className="gap-2 -ml-4">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>

        <div className="text-center py-16 max-w-md mx-auto">
          <h1 className="font-heading text-3xl mb-4">About</h1>
          <p className="text-muted-foreground mb-6">
            Log in to see your profile information and customize your about page.
          </p>
        </div>
      </div>
    );
  }

  // Loading
  if (author.isLoading) {
    return (
      <div className="container py-12">
        <div className="mb-6">
          <Button variant="ghost" asChild className="gap-2 -ml-4">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center mb-8">
            <Skeleton className="h-32 w-32 rounded-full mb-6" />
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-20 w-full max-w-md" />
          </div>
        </div>
      </div>
    );
  }

  const npub = nip19.npubEncode(user.pubkey);

  return (
    <div className="container py-12">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="gap-2 -ml-4">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <Avatar className="h-32 w-32 mb-6">
            <AvatarImage src={metadata?.picture} alt={metadata?.name} />
            <AvatarFallback className="text-4xl font-heading">
              {metadata?.name?.[0]?.toUpperCase() ?? '?'}
            </AvatarFallback>
          </Avatar>

          <h1 className="font-heading text-4xl mb-2">
            {metadata?.display_name ?? metadata?.name ?? 'Anonymous'}
          </h1>

          {metadata?.nip05 && (
            <p className="text-muted-foreground mb-4">{metadata.nip05}</p>
          )}

          {metadata?.about && (
            <p className="text-lg text-muted-foreground max-w-md whitespace-pre-wrap">
              {metadata.about}
            </p>
          )}
        </div>

        {/* Links and Contact */}
        <div className="grid gap-4 mb-12">
          {metadata?.website && (
            <Card>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Website</p>
                  <a
                    href={metadata.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {metadata.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          {metadata?.lud16 && (
            <Card>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Lightning Address</p>
                  <p className="text-foreground">{metadata.lud16}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">Nostr Public Key</p>
                <p className="text-foreground text-sm truncate font-mono">{npub}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Profile Link */}
        <div className="text-center">
          <Button variant="outline" asChild className="rounded-full">
            <Link to="/admin/settings">Edit Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
