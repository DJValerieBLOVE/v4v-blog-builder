import { useState } from 'react';
import { useHead } from '@unhead/react';
import { User, Palette, Zap, Database, Info, Upload, Loader2, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EditProfileForm } from '@/components/EditProfileForm';
import { RelayListManager } from '@/components/RelayListManager';
import { ThemeSettings } from '@/components/theme/ThemeSettings';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuthor } from '@/hooks/useAuthor';
import { useBlogSettings, useUpdateBlogSettings } from '@/hooks/useBlogSettings';
import { useUploadFile } from '@/hooks/useUploadFile';
import { useToast } from '@/hooks/useToast';
import type { BlogSettings } from '@/lib/blogSettings';

export function AdminSettings() {
  const { user } = useCurrentUser();
  const author = useAuthor(user?.pubkey);
  const metadata = author.data?.metadata;
  const { toast } = useToast();
  
  // Blog settings for About page
  const { data: blogSettings } = useBlogSettings();
  const { mutateAsync: updateSettings, isPending: isSavingAbout } = useUpdateBlogSettings();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();
  
  // Local state for About settings
  const [aboutSettings, setAboutSettings] = useState<Partial<BlogSettings['about']> | null>(null);
  
  const currentAbout = aboutSettings 
    ? { ...blogSettings?.about, ...aboutSettings }
    : blogSettings?.about;
  
  const hasAboutChanges = aboutSettings !== null;
  
  const handleSaveAbout = async () => {
    if (!aboutSettings) return;
    try {
      await updateSettings({ about: { ...blogSettings?.about, ...aboutSettings } });
      toast({ title: 'About page saved', description: 'Your about page has been updated.' });
      setAboutSettings(null);
    } catch {
      toast({ title: 'Error', description: 'Failed to save. Please try again.', variant: 'destructive' });
    }
  };
  
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const [[, url]] = await uploadFile(file);
      setAboutSettings(prev => ({ ...prev, writerPhoto: url }));
      toast({ title: 'Photo uploaded' });
    } catch {
      toast({ title: 'Upload failed', variant: 'destructive' });
    }
  };

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
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:w-auto lg:inline-flex">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-2">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">About</span>
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

        {/* About Tab */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">About Page</CardTitle>
              <CardDescription>
                Customize what appears on your public About page. You can describe yourself and what your blog is about.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Save Button */}
              {hasAboutChanges && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">You have unsaved changes</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setAboutSettings(null)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveAbout} disabled={isSavingAbout} className="gap-2">
                      {isSavingAbout ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      Save
                    </Button>
                  </div>
                </div>
              )}

              {/* Blog Description */}
              <div className="space-y-2">
                <Label htmlFor="blogDescription">What is your blog about?</Label>
                <Textarea
                  id="blogDescription"
                  value={currentAbout?.blogDescription ?? ''}
                  onChange={(e) => setAboutSettings(prev => ({ ...prev, blogDescription: e.target.value }))}
                  placeholder="Tell readers what topics you cover, your mission, or what they can expect from your blog..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  This appears at the top of your About page to introduce your blog.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">About the Writer</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Writer Name */}
                  <div className="space-y-2">
                    <Label htmlFor="writerName">Your Name</Label>
                    <Input
                      id="writerName"
                      value={currentAbout?.writerName ?? ''}
                      onChange={(e) => setAboutSettings(prev => ({ ...prev, writerName: e.target.value }))}
                      placeholder={metadata?.display_name ?? metadata?.name ?? 'Your display name'}
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave blank to use your Nostr profile name
                    </p>
                  </div>

                  {/* Writer Photo */}
                  <div className="space-y-2">
                    <Label>Your Photo</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={currentAbout?.writerPhoto ?? metadata?.picture} />
                        <AvatarFallback className="text-xl">
                          {(currentAbout?.writerName ?? metadata?.name)?.[0]?.toUpperCase() ?? '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={currentAbout?.writerPhoto ?? ''}
                            onChange={(e) => setAboutSettings(prev => ({ ...prev, writerPhoto: e.target.value }))}
                            placeholder="https://... or upload"
                            className="flex-1"
                          />
                          <Label
                            htmlFor="photo-upload"
                            className="inline-flex items-center justify-center rounded-md text-sm border border-input bg-background hover:bg-accent h-10 px-3 cursor-pointer"
                          >
                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          </Label>
                          <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoUpload}
                            disabled={isUploading}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Leave blank to use your Nostr profile picture
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Writer Bio */}
                <div className="space-y-2 mt-6">
                  <Label htmlFor="writerBio">Your Bio</Label>
                  <Textarea
                    id="writerBio"
                    value={currentAbout?.writerBio ?? ''}
                    onChange={(e) => setAboutSettings(prev => ({ ...prev, writerBio: e.target.value }))}
                    placeholder={metadata?.about ?? 'Tell readers about yourself, your background, and why you write...'}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave blank to use your Nostr profile bio
                  </p>
                </div>

                {/* Show Nostr Profile */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="space-y-0.5">
                    <Label>Show Nostr Profile Info</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your Lightning address, website, and npub on the About page
                    </p>
                  </div>
                  <Switch
                    checked={currentAbout?.showNostrProfile ?? true}
                    onCheckedChange={(checked) => setAboutSettings(prev => ({ ...prev, showNostrProfile: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Tab */}
        <TabsContent value="theme">
          <ThemeSettings />
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
