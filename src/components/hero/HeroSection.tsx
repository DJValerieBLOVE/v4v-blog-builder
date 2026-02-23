import { Sparkles, Zap } from 'lucide-react';
import { SubscribeForm } from './SubscribeForm';
import { NostrFollowButton } from './NostrFollowButton';
import { useBlogSettingsContext } from '@/components/theme/BlogSettingsProvider';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  authorPubkey?: string;
  className?: string;
}

export function HeroSection({ authorPubkey, className }: HeroSectionProps) {
  const { settings, isLoading } = useBlogSettingsContext();

  // Don't render if hero is disabled
  if (!settings.hero.enabled || isLoading) {
    return null;
  }

  const { style, title, subtitle, backgroundImage, showSubscribe } = settings.hero;

  if (style === 'minimal') {
    return (
      <MinimalHero
        title={title}
        subtitle={subtitle}
        showSubscribe={showSubscribe}
        authorPubkey={authorPubkey}
        className={className}
      />
    );
  }

  if (style === 'split') {
    return (
      <SplitHero
        title={title}
        subtitle={subtitle}
        backgroundImage={backgroundImage}
        showSubscribe={showSubscribe}
        authorPubkey={authorPubkey}
        className={className}
      />
    );
  }

  // Default: fullWidth
  return (
    <FullWidthHero
      title={title}
      subtitle={subtitle}
      backgroundImage={backgroundImage}
      showSubscribe={showSubscribe}
      authorPubkey={authorPubkey}
      className={className}
    />
  );
}

interface HeroVariantProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  showSubscribe: boolean;
  authorPubkey?: string;
  className?: string;
}

function FullWidthHero({
  title,
  subtitle,
  backgroundImage,
  showSubscribe,
  authorPubkey,
  className,
}: HeroVariantProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden py-20 md:py-28',
        backgroundImage ? 'text-white' : 'bg-gradient-to-b from-primary/5 to-background',
        className
      )}
    >
      {/* Background Image */}
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </>
      )}

      {/* Content */}
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary backdrop-blur mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Powered by Nostr & Lightning</span>
          </div>

          {title && (
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-6 animate-fade-up">
              {title}
            </h1>
          )}

          {subtitle && (
            <p
              className={cn(
                'text-lg md:text-xl mb-8 animate-fade-up',
                backgroundImage ? 'text-white/80' : 'text-muted-foreground'
              )}
              style={{ animationDelay: '0.1s' }}
            >
              {subtitle}
            </p>
          )}

          {showSubscribe && (
            <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <SubscribeForm variant="inline" authorPubkey={authorPubkey} />
            </div>
          )}
        </div>
      </div>

      {/* Decorative background */}
      {!backgroundImage && (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>
      )}
    </section>
  );
}

function SplitHero({
  title,
  subtitle,
  backgroundImage,
  showSubscribe,
  authorPubkey,
  className,
}: HeroVariantProps) {
  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary mb-6">
              <Zap className="h-4 w-4" />
              <span>V4V Blog</span>
            </div>

            {title && (
              <h1 className="font-heading text-4xl md:text-5xl mb-6">
                {title}
              </h1>
            )}

            {subtitle && (
              <p className="text-lg text-muted-foreground mb-8">
                {subtitle}
              </p>
            )}

            {showSubscribe && (
              <SubscribeForm variant="stacked" authorPubkey={authorPubkey} />
            )}
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            {backgroundImage ? (
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img
                  src={backgroundImage}
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Zap className="h-24 w-24 text-primary/30" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function MinimalHero({
  title,
  subtitle,
  showSubscribe,
  authorPubkey,
  className,
}: HeroVariantProps) {
  return (
    <section className={cn('py-16 md:py-20 border-b', className)}>
      <div className="container max-w-3xl">
        {title && (
          <h1 className="font-heading text-3xl md:text-4xl mb-4">
            {title}
          </h1>
        )}

        {subtitle && (
          <p className="text-lg text-muted-foreground mb-6">
            {subtitle}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          {showSubscribe && (
            <SubscribeForm variant="minimal" authorPubkey={authorPubkey} />
          )}
          <NostrFollowButton authorPubkey={authorPubkey} variant="outline" />
        </div>
      </div>
    </section>
  );
}
