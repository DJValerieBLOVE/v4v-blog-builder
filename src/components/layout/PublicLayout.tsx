import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

interface PublicLayoutProps {
  blogName?: string;
  children?: React.ReactNode;
}

export function PublicLayout({ blogName = 'V4V Blog', children }: PublicLayoutProps) {
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
