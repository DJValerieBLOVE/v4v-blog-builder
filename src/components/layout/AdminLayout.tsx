import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  PenSquare, 
  Settings, 
  Bookmark,
  ChevronLeft,
  Menu,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuthor } from '@/hooks/useAuthor';
import { useBlogOwner } from '@/hooks/useBlogOwner';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Articles', href: '/admin/articles', icon: FileText },
  { label: 'New Article', href: '/admin/editor', icon: PenSquare },
  { label: 'Bookmarks', href: '/admin/bookmarks', icon: Bookmark },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const { user } = useCurrentUser();
  const { isOwner, isBuilderMode } = useBlogOwner();
  const author = useAuthor(user?.pubkey);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const metadata = author.data?.metadata;

  // Require login for admin area
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Only blog owner can access admin
  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <AlertTriangle className="h-16 w-16 mx-auto text-muted-foreground" />
          <h1 className="font-heading text-2xl">Access Denied</h1>
          <p className="text-muted-foreground">
            Only the blog owner can access the admin area. 
            You can still read articles, leave comments, and zap content!
          </p>
          <Button asChild className="rounded-full">
            <Link to="/">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b">
          <Link to="/" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-heading text-lg">V4V Blog</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || 
              (item.href !== '/admin' && location.pathname.startsWith(item.href));
            
            return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={metadata?.picture} />
              <AvatarFallback className="font-heading">
                {metadata?.name?.[0]?.toUpperCase() ?? '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">
                {metadata?.name ?? 'Anonymous'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {metadata?.nip05 ?? 'No NIP-05'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex-1 flex flex-col">
        <header className="md:hidden h-16 flex items-center justify-between px-4 border-b">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              {/* Mobile Logo */}
              <div className="h-16 flex items-center px-6 border-b">
                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <Zap className="h-6 w-6 text-primary" />
                  <span className="font-heading text-lg">V4V Blog</span>
                </Link>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href || 
                    (item.href !== '/admin' && location.pathname.startsWith(item.href));
                  
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground'
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-heading text-lg">V4V Blog</span>
          </Link>

          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Builder Mode Warning */}
          {isBuilderMode && (
            <Alert className="m-4 border-yellow-500/50 bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                <strong>Builder Mode:</strong> No owner is configured. Anyone who logs in can access admin features. 
                Set <code className="bg-yellow-500/20 px-1 rounded">BLOG_OWNER_PUBKEY</code> in <code className="bg-yellow-500/20 px-1 rounded">src/lib/blogOwner.ts</code> before deploying.
              </AlertDescription>
            </Alert>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
