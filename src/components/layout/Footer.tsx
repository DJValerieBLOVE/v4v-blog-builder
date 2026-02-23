import { Link } from 'react-router-dom';
import { Zap, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  blogName?: string;
  className?: string;
}

export function Footer({ blogName = 'V4V Blog', className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn('border-t bg-background', className)}>
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Zap className="h-6 w-6 text-primary" />
              <span className="font-heading text-xl">{blogName}</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              A decentralized blog powered by Nostr and Lightning. Own your content, 
              accept value-for-value payments, and connect directly with your audience.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading text-sm mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading text-sm mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://nostr.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  What is Nostr?
                </a>
              </li>
              <li>
                <a 
                  href="https://bitcoin.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Bitcoin
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/DJValerieBLOVE/v4v-blog-builder" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {blogName}. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Vibed with</span>
            <Heart className="h-4 w-4 text-primary" />
            <span>on</span>
            <a 
              href="https://shakespeare.diy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Shakespeare
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
