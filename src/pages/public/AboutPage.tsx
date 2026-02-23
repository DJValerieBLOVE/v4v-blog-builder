import { useHead } from '@unhead/react';
import { nip19 } from 'nostr-tools';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Zap, Mail, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuthor } from '@/hooks/useAuthor';
import { useBlogSettingsContext } from '@/components/theme/BlogSettingsProvider';
import { useBlogOwner } from '@/hooks/useBlogOwner';

export function AboutPage() {
  const { user } = useCurrentUser();
  const { isOwner } = useBlogOwner();
  const { settings, isLoading: isLoadingSettings } = useBlogSettingsContext();
  const author = useAuthor(user?.pubkey);
  const metadata = author.data?.metadata;

  // Get about settings
  const about = settings.about;
  const hasCustomAbout = about?.writerName || about?.writerBio || about?.blogDescription;

  // Set page head
  useHead({
    title: about?.writerName 
      ? `About ${about.writerName} | ${settings.identity.blogName}`
      : metadata?.name 
        ? `About ${metadata.name} | ${settings.identity.blogName}` 
        : `About | ${settings.identity.blogName}`,
    meta: [
      { name: 'description', content: about?.blogDescription ?? about?.writerBio ?? metadata?.about ?? 'About the author' },
    ],
  });

  // Loading
  if (author.isLoading || isLoadingSettings) {
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

  // Determine what to display
  const displayName = about?.writerName || metadata?.display_name || metadata?.name || 'Anonymous';
  const displayPhoto = about?.writerPhoto || metadata?.picture;
  const displayBio = about?.writerBio || metadata?.about;

  const npub = user ? nip19.npubEncode(user.pubkey) : null;

  return (
    <div className="container py-12">
      {/* Back button */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild className="gap-2 -ml-4">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        
        {/* Edit button for owner */}
        {isOwner && (
          <Button variant="outline" size="sm" asChild className="gap-2 rounded-full">
            <Link to="/admin/settings">
              <Edit className="h-4 w-4" />
              Edit About
            </Link>
          </Button>
        )}
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Blog Description */}
        {about?.blogDescription && (
          <div className="mb-12 text-center">
            <h1 className="font-heading text-3xl md:text-4xl mb-4">
              About {settings.identity.blogName}
            </h1>
            <p className="text-lg text-muted-foreground whitespace-pre-wrap">
              {about.blogDescription}
            </p>
          </div>
        )}

        {/* Writer Section */}
        <div className="mb-12">
          {about?.blogDescription && (
            <h2 className="font-heading text-2xl mb-6 text-center">Meet the Writer</h2>
          )}
          
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <Avatar className="h-32 w-32 mb-6">
              <AvatarImage src={displayPhoto} alt={displayName} />
              <AvatarFallback className="text-4xl font-heading">
                {displayName[0]?.toUpperCase() ?? '?'}
              </AvatarFallback>
            </Avatar>

            <h2 className="font-heading text-3xl mb-2">
              {displayName}
            </h2>

            {metadata?.nip05 && about?.showNostrProfile !== false && (
              <p className="text-muted-foreground mb-4">{metadata.nip05}</p>
            )}

            {displayBio && (
              <p className="text-lg text-muted-foreground max-w-md whitespace-pre-wrap">
                {displayBio}
              </p>
            )}
          </div>
        </div>

        {/* Links and Contact - only show if using Nostr profile or explicitly enabled */}
        {(about?.showNostrProfile !== false || !hasCustomAbout) && user && (
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

            {npub && (
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
            )}
          </div>
        )}

        {/* Not logged in message */}
        {!user && !hasCustomAbout && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Log in to see your profile information and customize your about page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
