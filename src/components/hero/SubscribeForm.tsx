import { useState } from 'react';
import { Mail, Loader2, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNewsletterSubmit } from '@/hooks/useNewsletterSubmit';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

interface SubscribeFormProps {
  variant?: 'inline' | 'stacked' | 'minimal';
  authorPubkey?: string;
  className?: string;
}

export function SubscribeForm({
  variant = 'inline',
  authorPubkey,
  className,
}: SubscribeFormProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { mutateAsync: submitEmail, isPending } = useNewsletterSubmit();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await submitEmail({ email, authorPubkey });
      setSubmitted(true);
      setEmail('');
      toast({
        title: 'Subscribed!',
        description: 'Thank you for subscribing.',
      });
    } catch (error) {
      toast({
        title: 'Subscription failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  if (submitted) {
    return (
      <div className={cn('flex items-center gap-2 text-primary', className)}>
        <Check className="h-5 w-5" />
        <span className="font-medium">Thanks for subscribing!</span>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="max-w-xs rounded-full"
          disabled={isPending}
        />
        <Button type="submit" className="rounded-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </form>
    );
  }

  if (variant === 'stacked') {
    return (
      <form onSubmit={handleSubmit} className={cn('space-y-3 max-w-sm', className)}>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="pl-10 h-9 rounded-md"
            disabled={isPending}
          />
        </div>
        <Button
          type="submit"
          className="w-full rounded-md gap-2"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Subscribe
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Join the newsletter. Unsubscribe anytime.
        </p>
      </form>
    );
  }

  // Inline variant (default)
  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex flex-col sm:flex-row gap-3 max-w-md mx-auto',
        className
      )}
    >
      <div className="relative flex-1">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="pl-10 h-9 rounded-md"
          disabled={isPending}
        />
      </div>
      <Button
        type="submit"
        className="px-8 rounded-md gap-2"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Subscribe
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
