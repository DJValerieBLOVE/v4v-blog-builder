import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap } from 'lucide-react';
import type { BlogSettings } from '@/lib/blogSettings';

interface SitePreviewProps {
  settings: BlogSettings;
  className?: string;
}

/**
 * Live preview of the blog site based on current settings
 */
export function SitePreview({ settings, className }: SitePreviewProps) {
  const { identity, theme, hero } = settings;
  const colors = theme.colors;
  const layout = theme.preset;

  // Get border radius value
  const radiusMap: Record<string, string> = {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  };
  const borderRadius = radiusMap[theme.borderRadius] ?? '8px';

  return (
    <div 
      className={className}
      style={{
        backgroundColor: colors.background,
        color: colors.foreground,
        fontFamily: theme.fonts.body,
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Mini Header */}
      <div 
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ borderColor: colors.border, backgroundColor: colors.card }}
      >
        <span 
          className="font-semibold text-sm"
          style={{ fontFamily: theme.fonts.heading }}
        >
          {identity.logo?.type === 'text' 
            ? (identity.logo.text || identity.blogName) 
            : identity.blogName}
        </span>
        <div className="flex gap-2 text-xs" style={{ color: colors.muted }}>
          <span>Articles</span>
          <span>About</span>
        </div>
      </div>

      {/* Mini Hero */}
      {hero.enabled && (
        <div 
          className="px-4 py-6 text-center relative"
          style={{
            backgroundColor: hero.backgroundImage ? 'transparent' : colors.card,
            backgroundImage: hero.backgroundImage ? `url(${hero.backgroundImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {hero.backgroundImage && (
            <div 
              className="absolute inset-0" 
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            />
          )}
          <div className="relative z-10">
            <Badge 
              variant="outline" 
              className="mb-2 text-xs"
              style={{ 
                borderColor: hero.backgroundImage ? 'white' : colors.primary,
                color: hero.backgroundImage ? 'white' : colors.primary,
              }}
            >
              <Zap className="h-2 w-2 mr-1" />
              V4V
            </Badge>
            <h2 
              className="text-sm font-semibold mb-1"
              style={{ 
                fontFamily: theme.fonts.heading,
                color: hero.backgroundImage ? 'white' : colors.foreground,
              }}
            >
              {hero.title || identity.blogName}
            </h2>
            <p 
              className="text-xs mb-3"
              style={{ color: hero.backgroundImage ? 'rgba(255,255,255,0.8)' : colors.muted }}
            >
              {hero.subtitle || identity.tagline}
            </p>
            {hero.showSubscribe && (
              <div className="flex gap-1 max-w-[200px] mx-auto">
                <Input 
                  placeholder="email@example.com" 
                  className="h-6 text-xs rounded-full"
                  style={{ 
                    backgroundColor: hero.backgroundImage ? 'white' : colors.background,
                    borderColor: colors.border,
                  }}
                />
                <Button 
                  size="sm" 
                  className="h-6 text-xs px-3 rounded-full"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: colors.background,
                  }}
                >
                  Subscribe
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Featured Article Hero Section - Same for all layouts */}
      <div 
        className="relative overflow-hidden"
        style={{ borderRadius }}
      >
        {/* Featured Image Background */}
        <div className="aspect-[16/9] bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 relative">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Featured Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-3">
            <Badge 
              variant="secondary" 
              className="w-fit text-[7px] mb-1 px-1.5 py-0"
              style={{ backgroundColor: colors.primary, color: colors.background }}
            >
              Featured
            </Badge>
            <p 
              className="text-[11px] font-semibold text-white line-clamp-2 mb-0.5"
              style={{ fontFamily: theme.fonts.heading }}
            >
              The Featured Article Title
            </p>
            <p className="text-[8px] text-white/70 line-clamp-1">
              A compelling summary that draws readers in...
            </p>
            <p className="text-[7px] text-white/50 mt-1">
              Feb 23, 2026
            </p>
          </div>
        </div>
      </div>

      {/* Mini Articles */}
      <div className="p-4">
        <h3 
          className="text-xs font-semibold mb-3"
          style={{ fontFamily: theme.fonts.heading }}
        >
          Latest Articles
        </h3>

        {layout === 'magazine' && (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <Card key={i} style={{ backgroundColor: colors.card, borderColor: colors.border, borderRadius }}>
                <AspectRatio ratio={16/9} className="overflow-hidden" style={{ borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }}>
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                </AspectRatio>
                <CardContent className="p-2">
                  <p 
                    className="text-[8px] font-medium line-clamp-2"
                    style={{ fontFamily: theme.fonts.heading }}
                  >
                    Article Title {i}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {layout === 'newsletter' && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Card 
                key={i} 
                className="flex gap-2 overflow-hidden" 
                style={{ backgroundColor: colors.card, borderColor: colors.border, borderRadius }}
              >
                <div className="w-16 h-12 bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0" />
                <div className="p-2 flex-1">
                  <p 
                    className="text-[9px] font-medium line-clamp-1"
                    style={{ fontFamily: theme.fonts.heading }}
                  >
                    Newsletter Article {i}
                  </p>
                  <p className="text-[7px] line-clamp-1" style={{ color: colors.muted }}>
                    A brief description of the article...
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {layout === 'minimal' && (
          <div className="space-y-2 max-w-[180px] mx-auto">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="py-2 border-b"
                style={{ borderColor: colors.border }}
              >
                <p 
                  className="text-[9px] font-medium"
                  style={{ fontFamily: theme.fonts.heading }}
                >
                  Minimal Article Title {i}
                </p>
                <p className="text-[7px]" style={{ color: colors.muted }}>
                  Feb {20 + i}, 2026
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mini Footer */}
      <div 
        className="px-4 py-2 text-center border-t"
        style={{ borderColor: colors.border, backgroundColor: colors.card }}
      >
        <p className="text-[8px]" style={{ color: colors.muted }}>
          {identity.blogName} - Powered by Nostr
        </p>
      </div>
    </div>
  );
}
