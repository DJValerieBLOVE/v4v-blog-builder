import { useHead } from '@unhead/react';
import { User, Palette, Zap, Rss, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditProfileForm } from '@/components/EditProfileForm';
import { RelayListManager } from '@/components/RelayListManager';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuthor } from '@/hooks/useAuthor';

export function AdminSettings() {
  const { user } = useCurrentUser();
  const author = useAuthor(user?.pubkey);
  const metadata = author.data?.metadata;

  useHead({
    title: 'Settings | V4V Blog Admin',
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl">Settings</h1>
        <p className="text-muted-foreground">
          Configure your blog and profile
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="theme" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Theme</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
          <TabsTrigger value="relays" className="gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Relays</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Profile Settings</CardTitle>
              <CardDescription>
                Update your Nostr profile information. Changes are published to your relays.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditProfileForm />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Tab */}
        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Theme Settings</CardTitle>
              <CardDescription>
                Customize the appearance of your blog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Palette className="h-16 w-16 mx-auto text-muted-foreground/50 mb-6" />
                <h3 className="font-heading text-xl mb-4">Coming Soon</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Theme customization including layout presets (Magazine, Newsletter, Minimal), 
                  color schemes, and font selection will be available in Phase 4.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Lightning Payments</CardTitle>
              <CardDescription>
                Configure how readers can send you zaps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Lightning Address */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="font-medium">Current Lightning Address</span>
                </div>
                <p className="text-lg font-mono">
                  {metadata?.lud16 ?? 'Not configured'}
                </p>
                {!metadata?.lud16 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Add a Lightning address to your profile to receive zaps.
                  </p>
                )}
              </div>

              {/* Info */}
              <div className="space-y-4">
                <h4 className="font-medium">How Zaps Work</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">1.</span>
                    Set your Lightning address in your Nostr profile (lud16)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">2.</span>
                    Readers can zap your articles using their Nostr wallet
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">3.</span>
                    Zaps are recorded on Nostr and displayed on your articles
                  </li>
                </ul>
              </div>

              {/* Recommended Wallets */}
              <div>
                <h4 className="font-medium mb-3">Recommended Lightning Wallets</h4>
                <div className="grid gap-3">
                  <a
                    href="https://getalby.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Alby</p>
                      <p className="text-sm text-muted-foreground">Browser extension wallet</p>
                    </div>
                  </a>
                  <a
                    href="https://www.walletofsatoshi.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Wallet of Satoshi</p>
                      <p className="text-sm text-muted-foreground">Mobile wallet with Lightning address</p>
                    </div>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relays Tab */}
        <TabsContent value="relays">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Nostr Relays</CardTitle>
              <CardDescription>
                Manage which relays store and serve your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RelayListManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
