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
import type { AboutSection } from '@/lib/blogSettings';

export function AboutPage() {
  const { user } = useCurrentUser();
  const { isOwner } = useBlogOwner();
  const { settings, isLoading: isLoadingSettings } = useBlogSettingsContext();
  const author = useAuthor(user?.pubkey);
  const metadata = author.data?.metadata;

  // Get enabled sections
  const sections = settings.about?.sections?.filter(s => s.enabled) ?? [];

  // Set page head
  useHead({
    title: `About | ${settings.identity.blogName}`,
    meta: [
      { name: 'description', content: 'Learn more about this blog and its author.' },
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

        <div className="max-w-2xl mx-auto space-y-8">
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="flex flex-col items-center">
            <Skeleton className="h-24 w-24 rounded-full mb-4" />
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

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

      <div className="max-w-2xl mx-auto space-y-12">
        {sections.length === 0 ? (
          // Default fallback if no sections configured
          <DefaultAboutContent 
            metadata={metadata} 
            npub={npub}
            blogName={settings.identity.blogName}
          />
        ) : (
          // Render configured sections
          sections.map((section) => (
            <AboutSectionRenderer 
              key={section.id} 
              section={section} 
              metadata={metadata}
              npub={npub}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface AboutSectionRendererProps {
  section: AboutSection;
  metadata?: { name?: string; display_name?: string; picture?: string; about?: string; website?: string; lud16?: string };
  npub: string | null;
}

function AboutSectionRenderer({ section, metadata, npub }: AboutSectionRendererProps) {
  switch (section.type) {
    case 'hero':
      return (
        <div 
          className="rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
          style={{
            backgroundImage: section.image ? `url(${section.image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: section.image ? undefined : 'hsl(var(--muted))',
          }}
        >
          {section.image && (
            <div className="absolute inset-0 bg-black/50" />
          )}
          <div className="relative z-10">
            <h1 
              className="font-heading text-3xl md:text-4xl mb-4"
              style={{ color: section.image ? 'white' : undefined }}
            >
              {section.title || 'About This Blog'}
            </h1>
            {section.content && (
              <p 
                className="text-lg md:text-xl max-w-xl mx-auto whitespace-pre-wrap"
                style={{ color: section.image ? 'rgba(255,255,255,0.9)' : 'hsl(var(--muted-foreground))' }}
              >
                {section.content}
              </p>
            )}
          </div>
        </div>
      );

    case 'writer':
      const displayName = section.writerName || metadata?.display_name || metadata?.name || 'Anonymous';
      const displayPhoto = section.writerPhoto || metadata?.picture;
      const displayBio = section.writerBio || metadata?.about;
      
      return (
        <div className="text-center">
          {section.title && (
            <h2 className="font-heading text-2xl mb-6">{section.title}</h2>
          )}
          <Avatar className="h-32 w-32 mx-auto mb-6">
            <AvatarImage src={displayPhoto} alt={displayName} />
            <AvatarFallback className="text-4xl font-heading">
              {displayName[0]?.toUpperCase() ?? '?'}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-heading text-2xl mb-2">{displayName}</h3>
          {displayBio && (
            <p className="text-muted-foreground text-lg max-w-md mx-auto whitespace-pre-wrap">
              {displayBio}
            </p>
          )}
        </div>
      );

    case 'text':
    case 'mission':
      return (
        <div className="text-center">
          {section.title && (
            <h2 className="font-heading text-2xl mb-4">{section.title}</h2>
          )}
          {section.content && (
            <p className="text-muted-foreground text-lg whitespace-pre-wrap">
              {section.content}
            </p>
          )}
        </div>
      );

    case 'contact':
      return (
        <div>
          {section.title && (
            <h2 className="font-heading text-2xl mb-6 text-center">{section.title}</h2>
          )}
          <div className="grid gap-4">
            {section.showWebsite && metadata?.website && (
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

            {section.showLightning && metadata?.lud16 && (
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

            {section.showNpub && npub && (
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
        </div>
      );

    case 'social':
      return (
        <div className="text-center">
          {section.title && (
            <h2 className="font-heading text-2xl mb-4">{section.title}</h2>
          )}
          <p className="text-muted-foreground">
            Social links coming soon...
          </p>
        </div>
      );

    default:
      return null;
  }
}

interface DefaultAboutContentProps {
  metadata?: { name?: string; display_name?: string; picture?: string; about?: string; website?: string; lud16?: string };
  npub: string | null;
  blogName: string;
}

function DefaultAboutContent({ metadata, npub, blogName }: DefaultAboutContentProps) {
  const displayName = metadata?.display_name || metadata?.name || 'Anonymous';

  return (
    <>
      {/* Hero */}
      <div className="text-center">
        <h1 className="font-heading text-3xl md:text-4xl mb-4">About {blogName}</h1>
        <p className="text-muted-foreground text-lg">
          Welcome to my corner of the internet.
        </p>
      </div>

      {/* Writer */}
      <div className="text-center">
        <h2 className="font-heading text-2xl mb-6">Meet the Writer</h2>
        <Avatar className="h-32 w-32 mx-auto mb-6">
          <AvatarImage src={metadata?.picture} alt={displayName} />
          <AvatarFallback className="text-4xl font-heading">
            {displayName[0]?.toUpperCase() ?? '?'}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-heading text-2xl mb-2">{displayName}</h3>
        {metadata?.about && (
          <p className="text-muted-foreground text-lg max-w-md mx-auto whitespace-pre-wrap">
            {metadata.about}
          </p>
        )}
      </div>

      {/* Contact */}
      <div>
        <h2 className="font-heading text-2xl mb-6 text-center">Get in Touch</h2>
        <div className="grid gap-4">
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
      </div>
    </>
  );
}
