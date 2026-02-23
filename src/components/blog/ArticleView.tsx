import { Link } from 'react-router-dom';
import { nip19 } from 'nostr-tools';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';
import { useAuthor } from '@/hooks/useAuthor';
import { formatDate, calculateReadingTime, type ArticleData } from '@/lib/article';
import { EngagementBar } from '@/components/engagement/EngagementBar';
import { CommentSection } from '@/components/engagement/CommentSection';
import { cn } from '@/lib/utils';

interface ArticleViewProps {
  article: ArticleData;
  className?: string;
}

export function ArticleView({ article, className }: ArticleViewProps) {
  const author = useAuthor(article.pubkey);
  const npub = nip19.npubEncode(article.pubkey);
  const readingTime = calculateReadingTime(article.content);
  const metadata = author.data?.metadata;

  return (
    <article className={cn('max-w-4xl mx-auto', className)}>
      {/* Back button */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="gap-2 -ml-4">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to articles
          </Link>
        </Button>
      </div>

      {/* Article Header */}
      <header className="mb-8">
        {/* Category */}
        {article.category && (
          <Link to={`/category/${article.category.toLowerCase()}`}>
            <Badge variant="secondary" className="mb-4 hover:bg-primary hover:text-primary-foreground transition-colors">
              {article.category}
            </Badge>
          </Link>
        )}

        {/* Title */}
        <h1 className="font-heading text-article-title md:text-article-xl mb-6">
          {article.title}
        </h1>

        {/* Summary */}
        {article.summary && (
          <p className="text-xl text-muted-foreground mb-8">
            {article.summary}
          </p>
        )}

        {/* Author and Meta */}
        <div className="flex flex-wrap items-center gap-6 pb-8 border-b">
          {/* Author */}
          <Link 
            to={`/${npub}`}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={metadata?.picture} alt={metadata?.name} />
              <AvatarFallback className="font-heading">
                {metadata?.name?.[0]?.toUpperCase() ?? '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{metadata?.name ?? 'Anonymous'}</p>
              {metadata?.nip05 && (
                <p className="text-sm text-muted-foreground">{metadata.nip05}</p>
              )}
            </div>
          </Link>

          {/* Date */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>

          {/* Reading time */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{readingTime} min read</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {article.image && (
        <div className="mb-12">
          <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg">
            <img
              src={article.image}
              alt={article.title}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
        </div>
      )}

      {/* Article Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <ArticleContent content={article.content} />
      </div>

      {/* Tags */}
      {article.tags.length > 0 && (
        <footer className="pt-8 border-t">
          <div className="flex items-center gap-3 flex-wrap">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {article.tags.map((tag) => (
              <Link key={tag} to={`/tag/${tag}`}>
                <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>
        </footer>
      )}

      {/* Engagement Bar */}
      <Separator className="my-8" />
      <EngagementBar
        article={article.event}
        authorPubkey={article.pubkey}
        slug={article.slug}
        title={article.title}
        summary={article.summary}
        className="mb-8"
      />

      {/* Comments Section */}
      <Separator className="my-8" />
      <CommentSection article={article.event} />
    </article>
  );
}

/**
 * Simple markdown-like content renderer
 * For full markdown support, consider using a library like react-markdown
 */
function ArticleContent({ content }: { content: string }) {
  // Split content by double newlines for paragraphs
  const blocks = content.split(/\n\n+/);

  return (
    <>
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        
        // Headers
        if (trimmed.startsWith('# ')) {
          return <h1 key={index}>{trimmed.slice(2)}</h1>;
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={index}>{trimmed.slice(3)}</h2>;
        }
        if (trimmed.startsWith('### ')) {
          return <h3 key={index}>{trimmed.slice(4)}</h3>;
        }
        if (trimmed.startsWith('#### ')) {
          return <h4 key={index}>{trimmed.slice(5)}</h4>;
        }

        // Blockquote
        if (trimmed.startsWith('> ')) {
          const quoteContent = trimmed.split('\n').map(line => 
            line.startsWith('> ') ? line.slice(2) : line
          ).join('\n');
          return <blockquote key={index}>{quoteContent}</blockquote>;
        }

        // Unordered list
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').filter(line => line.match(/^[-*] /));
          return (
            <ul key={index}>
              {items.map((item, i) => (
                <li key={i}>{item.slice(2)}</li>
              ))}
            </ul>
          );
        }

        // Ordered list
        if (trimmed.match(/^\d+\. /)) {
          const items = trimmed.split('\n').filter(line => line.match(/^\d+\. /));
          return (
            <ol key={index}>
              {items.map((item, i) => (
                <li key={i}>{item.replace(/^\d+\. /, '')}</li>
              ))}
            </ol>
          );
        }

        // Code block
        if (trimmed.startsWith('```')) {
          const codeContent = trimmed.slice(3).replace(/```$/, '');
          const firstNewline = codeContent.indexOf('\n');
          const code = firstNewline > -1 ? codeContent.slice(firstNewline + 1) : codeContent;
          return (
            <pre key={index}>
              <code>{code.trim()}</code>
            </pre>
          );
        }

        // Horizontal rule
        if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
          return <hr key={index} />;
        }

        // Regular paragraph - process inline formatting
        if (trimmed) {
          return <p key={index} dangerouslySetInnerHTML={{ __html: processInlineFormatting(trimmed) }} />;
        }

        return null;
      })}
    </>
  );
}

/**
 * Process inline markdown formatting
 */
function processInlineFormatting(text: string): string {
  return text
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Code
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Line breaks
    .replace(/\n/g, '<br />');
}

export function ArticleViewSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <Skeleton className="h-8 w-32 mb-8" />
      
      <header className="mb-8">
        <Skeleton className="h-6 w-24 mb-4" />
        <Skeleton className="h-12 w-full mb-2" />
        <Skeleton className="h-12 w-3/4 mb-6" />
        <Skeleton className="h-6 w-full mb-8" />
        
        <div className="flex items-center gap-6 pb-8 border-b">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>
      </header>
      
      <div className="mb-12">
        <AspectRatio ratio={16 / 9}>
          <Skeleton className="w-full h-full rounded-lg" />
        </AspectRatio>
      </div>
      
      <div className="space-y-4 mb-12">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
      </div>
    </div>
  );
}
