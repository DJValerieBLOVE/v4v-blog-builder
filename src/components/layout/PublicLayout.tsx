import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { BlogSettingsProvider, useBlogSettingsContext } from '@/components/theme/BlogSettingsProvider';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface PublicLayoutProps {
  children?: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const { user } = useCurrentUser();

  return (
    <BlogSettingsProvider authorPubkey={user?.pubkey}>
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
