import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { BlogSettingsProvider, useBlogSettingsContext } from '@/components/theme/BlogSettingsProvider';
import { BLOG_OWNER_PUBKEY } from '@/lib/blogOwner';

interface PublicLayoutProps {
  children?: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  // Always use the BLOG OWNER's settings for the public site
  // This ensures visitors see the owner's customizations, not their own
  return (
    <BlogSettingsProvider authorPubkey={BLOG_OWNER_PUBKEY ?? undefined}>
      <PublicLayoutContent>{children}</PublicLayoutContent>
    </BlogSettingsProvider>
  );
}

function PublicLayoutContent({ children }: { children?: React.ReactNode }) {
  const { settings } = useBlogSettingsContext();
  const blogName = settings.identity.blogName;

  return (
    <div className="min-h-screen flex flex-col">
      <Header blogName={blogName} />
      <main className="flex-1">
        {children ?? <Outlet />}
      </main>
      <Footer blogName={blogName} />
    </div>
  );
}
