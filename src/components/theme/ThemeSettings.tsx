import { useState } from 'react';
import { Palette, Layout, Type, Image, Loader2, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useUploadFile } from '@/hooks/useUploadFile';
import { useBlogSettings, useUpdateBlogSettings } from '@/hooks/useBlogSettings';
import { useToast } from '@/hooks/useToast';
import { 
  type BlogSettings,
  type ThemeColors,
  themePresets, 
  colorPresets,
  defaultBlogSettings,
} from '@/lib/blogSettings';
import { cn } from '@/lib/utils';

// Helper to build complete theme colors
const buildColors = (currentColors: Partial<ThemeColors> | undefined, updates: Partial<ThemeColors>): ThemeColors => ({
  primary: updates.primary ?? currentColors?.primary ?? defaultBlogSettings.theme.colors.primary,
  background: updates.background ?? currentColors?.background ?? defaultBlogSettings.theme.colors.background,
  foreground: updates.foreground ?? currentColors?.foreground ?? defaultBlogSettings.theme.colors.foreground,
  muted: updates.muted ?? currentColors?.muted ?? defaultBlogSettings.theme.colors.muted,
  border: updates.border ?? currentColors?.border ?? defaultBlogSettings.theme.colors.border,
  card: updates.card ?? currentColors?.card ?? defaultBlogSettings.theme.colors.card,
});

export function ThemeSettings() {
  const { data: settings, isLoading } = useBlogSettings();
  const { mutateAsync: updateSettings, isPending: isSaving } = useUpdateBlogSettings();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();
  const { toast } = useToast();

  // Local state for form
  const [localSettings, setLocalSettings] = useState<Partial<BlogSettings> | null>(null);

  // Merge local changes with server settings
  const currentSettings = localSettings 
    ? { ...settings, ...localSettings }
    : settings;

  const handleSave = async () => {
    if (!localSettings) return;

    try {
      await updateSettings(localSettings);
      toast({
        title: 'Settings saved',
        description: 'Your blog settings have been updated.',
      });
      setLocalSettings(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const updateLocal = (updates: Partial<BlogSettings>) => {
    setLocalSettings(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const [[, url]] = await uploadFile(file);
      updateLocal({
        identity: {
          ...currentSettings?.identity,
          blogName: currentSettings?.identity?.blogName ?? 'V4V Blog',
          logo: { type: 'image', imageUrl: url },
        },
      });
      toast({ title: 'Logo uploaded' });
    } catch {
      toast({ title: 'Upload failed', variant: 'destructive' });
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const [[, url]] = await uploadFile(file);
      updateLocal({
        hero: {
          ...currentSettings?.hero,
          enabled: currentSettings?.hero?.enabled ?? true,
          style: currentSettings?.hero?.style ?? 'fullWidth',
          showSubscribe: currentSettings?.hero?.showSubscribe ?? true,
          backgroundImage: url,
        },
      });
      toast({ title: 'Hero image uploaded' });
    } catch {
      toast({ title: 'Upload failed', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const hasChanges = localSettings !== null;

  return (
    <div className="space-y-6">
      {/* Save Button */}
      {hasChanges && (
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-4 -mx-6 px-6 border-b">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">You have unsaved changes</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setLocalSettings(null)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="identity" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="identity" className="gap-2">
            <Type className="h-4 w-4" />
            <span className="hidden sm:inline">Identity</span>
          </TabsTrigger>
          <TabsTrigger value="theme" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Theme</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="gap-2">
            <Layout className="h-4 w-4" />
            <span className="hidden sm:inline">Layout</span>
          </TabsTrigger>
          <TabsTrigger value="hero" className="gap-2">
            <Image className="h-4 w-4" />
            <span className="hidden sm:inline">Hero</span>
          </TabsTrigger>
        </TabsList>

        {/* Identity Tab */}
        <TabsContent value="identity">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Blog Identity</CardTitle>
              <CardDescription>Set your blog name, tagline, and logo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Blog Name */}
              <div className="space-y-2">
                <Label htmlFor="blogName">Blog Name</Label>
                <Input
                  id="blogName"
                  value={currentSettings?.identity?.blogName ?? ''}
                  onChange={(e) => updateLocal({
                    identity: {
                      ...currentSettings?.identity,
                      blogName: e.target.value,
                      logo: currentSettings?.identity?.logo ?? { type: 'text' },
                    },
                  })}
                  placeholder="My Awesome Blog"
                />
              </div>

              {/* Tagline */}
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={currentSettings?.identity?.tagline ?? ''}
                  onChange={(e) => updateLocal({
                    identity: {
                      ...currentSettings?.identity,
                      blogName: currentSettings?.identity?.blogName ?? 'V4V Blog',
                      tagline: e.target.value,
                      logo: currentSettings?.identity?.logo ?? { type: 'text' },
                    },
                  })}
                  placeholder="Thoughts on Bitcoin and Freedom"
                />
              </div>

              {/* Logo */}
              <div className="space-y-4">
                <Label>Logo</Label>
                <RadioGroup
                  value={currentSettings?.identity?.logo?.type ?? 'text'}
                  onValueChange={(value) => updateLocal({
                    identity: {
                      ...currentSettings?.identity,
                      blogName: currentSettings?.identity?.blogName ?? 'V4V Blog',
                      logo: {
                        type: value as 'text' | 'image',
                        text: currentSettings?.identity?.logo?.text,
                        imageUrl: currentSettings?.identity?.logo?.imageUrl,
                      },
                    },
                  })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="logo-text" />
                    <Label htmlFor="logo-text">Text Logo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="image" id="logo-image" />
                    <Label htmlFor="logo-image">Image Logo</Label>
                  </div>
                </RadioGroup>

                {currentSettings?.identity?.logo?.type === 'text' && (
                  <Input
                    value={currentSettings?.identity?.logo?.text ?? currentSettings?.identity?.blogName ?? ''}
                    onChange={(e) => updateLocal({
                      identity: {
                        ...currentSettings?.identity,
                        blogName: currentSettings?.identity?.blogName ?? 'V4V Blog',
                        logo: {
                          type: 'text',
                          text: e.target.value,
                        },
                      },
                    })}
                    placeholder="Logo text"
                  />
                )}

                {currentSettings?.identity?.logo?.type === 'image' && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={currentSettings?.identity?.logo?.imageUrl ?? ''}
                        onChange={(e) => updateLocal({
                          identity: {
                            ...currentSettings?.identity,
                            blogName: currentSettings?.identity?.blogName ?? 'V4V Blog',
                            logo: { type: 'image', imageUrl: e.target.value },
                          },
                        })}
                        placeholder="https://..."
                        className="flex-1"
                      />
                      <Label
                        htmlFor="logo-upload"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent h-10 px-4 cursor-pointer"
                      >
                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upload'}
                      </Label>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                        disabled={isUploading}
                      />
                    </div>
                    {currentSettings?.identity?.logo?.imageUrl && (
                      <div className="w-32 h-16 rounded border overflow-hidden">
                        <img
                          src={currentSettings.identity.logo.imageUrl}
                          alt="Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Tab */}
        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Theme Colors</CardTitle>
              <CardDescription>Customize your blog's colors and appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Color Presets */}
              <div className="space-y-3">
                <Label>Quick Color Presets</Label>
                <div className="grid grid-cols-6 gap-3">
                  {Object.entries(colorPresets).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => updateLocal({
                        theme: {
                          ...currentSettings?.theme,
                          preset: currentSettings?.theme?.preset ?? 'magazine',
                          colors: buildColors(currentSettings?.theme?.colors, { primary: preset.primary }),
                          darkMode: currentSettings?.theme?.darkMode ?? { enabled: true },
                          fonts: currentSettings?.theme?.fonts ?? { heading: 'Marcellus', body: 'Marcellus' },
                          borderRadius: currentSettings?.theme?.borderRadius ?? 'md',
                        },
                      })}
                      className={cn(
                        'w-full aspect-square rounded-full border-2 transition-all',
                        currentSettings?.theme?.colors?.primary === preset.primary
                          ? 'border-foreground scale-110'
                          : 'border-transparent hover:scale-105'
                      )}
                      style={{ backgroundColor: preset.primary }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              {/* Button / Accent Color */}
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Button & Accent Color</Label>
                <p className="text-sm text-muted-foreground">Used for buttons, links, and highlights</p>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={currentSettings?.theme?.colors?.primary ?? '#2D2D2D'}
                    onChange={(e) => updateLocal({
                      theme: {
                        ...currentSettings?.theme,
                        preset: currentSettings?.theme?.preset ?? 'magazine',
                        colors: buildColors(currentSettings?.theme?.colors, { primary: e.target.value }),
                        darkMode: currentSettings?.theme?.darkMode ?? { enabled: true },
                        fonts: currentSettings?.theme?.fonts ?? { heading: 'Marcellus', body: 'Marcellus' },
                        borderRadius: currentSettings?.theme?.borderRadius ?? 'md',
                      },
                    })}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={currentSettings?.theme?.colors?.primary ?? '#2D2D2D'}
                    onChange={(e) => updateLocal({
                      theme: {
                        ...currentSettings?.theme,
                        preset: currentSettings?.theme?.preset ?? 'magazine',
                        colors: buildColors(currentSettings?.theme?.colors, { primary: e.target.value }),
                        darkMode: currentSettings?.theme?.darkMode ?? { enabled: true },
                        fonts: currentSettings?.theme?.fonts ?? { heading: 'Marcellus', body: 'Marcellus' },
                        borderRadius: currentSettings?.theme?.borderRadius ?? 'md',
                      },
                    })}
                    placeholder="#2D2D2D"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div className="space-y-2">
                <Label htmlFor="bgColor">Background Color</Label>
                <p className="text-sm text-muted-foreground">Main page background</p>
                <div className="flex gap-2">
                  <Input
                    id="bgColor"
                    type="color"
                    value={currentSettings?.theme?.colors?.background ?? '#FFFFFF'}
                    onChange={(e) => updateLocal({
                      theme: {
                        ...currentSettings?.theme,
                        preset: currentSettings?.theme?.preset ?? 'magazine',
                        colors: buildColors(currentSettings?.theme?.colors, { background: e.target.value }),
                        darkMode: currentSettings?.theme?.darkMode ?? { enabled: true },
                        fonts: currentSettings?.theme?.fonts ?? { heading: 'Marcellus', body: 'Marcellus' },
                        borderRadius: currentSettings?.theme?.borderRadius ?? 'md',
                      },
                    })}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={currentSettings?.theme?.colors?.background ?? '#FFFFFF'}
                    onChange={(e) => updateLocal({
                      theme: {
                        ...currentSettings?.theme,
                        preset: currentSettings?.theme?.preset ?? 'magazine',
                        colors: buildColors(currentSettings?.theme?.colors, { background: e.target.value }),
                        darkMode: currentSettings?.theme?.darkMode ?? { enabled: true },
                        fonts: currentSettings?.theme?.fonts ?? { heading: 'Marcellus', body: 'Marcellus' },
                        borderRadius: currentSettings?.theme?.borderRadius ?? 'md',
                      },
                    })}
                    placeholder="#FFFFFF"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Text Color */}
              <div className="space-y-2">
                <Label htmlFor="textColor">Text Color</Label>
                <p className="text-sm text-muted-foreground">Main text and headings</p>
                <div className="flex gap-2">
                  <Input
                    id="textColor"
                    type="color"
                    value={currentSettings?.theme?.colors?.foreground ?? '#18181B'}
                    onChange={(e) => updateLocal({
                      theme: {
                        ...currentSettings?.theme,
                        preset: currentSettings?.theme?.preset ?? 'magazine',
                        colors: buildColors(currentSettings?.theme?.colors, { foreground: e.target.value }),
                        darkMode: currentSettings?.theme?.darkMode ?? { enabled: true },
                        fonts: currentSettings?.theme?.fonts ?? { heading: 'Marcellus', body: 'Marcellus' },
                        borderRadius: currentSettings?.theme?.borderRadius ?? 'md',
                      },
                    })}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={currentSettings?.theme?.colors?.foreground ?? '#18181B'}
                    onChange={(e) => updateLocal({
                      theme: {
                        ...currentSettings?.theme,
                        preset: currentSettings?.theme?.preset ?? 'magazine',
                        colors: buildColors(currentSettings?.theme?.colors, { foreground: e.target.value }),
                        darkMode: currentSettings?.theme?.darkMode ?? { enabled: true },
                        fonts: currentSettings?.theme?.fonts ?? { heading: 'Marcellus', body: 'Marcellus' },
                        borderRadius: currentSettings?.theme?.borderRadius ?? 'md',
                      },
                    })}
                    placeholder="#18181B"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Card Background Color */}
              <div className="space-y-2">
                <Label htmlFor="cardColor">Card Background</Label>
                <p className="text-sm text-muted-foreground">Article cards and panels</p>
                <div className="flex gap-2">
                  <Input
                    id="cardColor"
                    type="color"
                    value={currentSettings?.theme?.colors?.card ?? '#FAFAFA'}
                    onChange={(e) => updateLocal({
                      theme: {
                        ...currentSettings?.theme,
                        preset: currentSettings?.theme?.preset ?? 'magazine',
                        colors: buildColors(currentSettings?.theme?.colors, { card: e.target.value }),
                        darkMode: currentSettings?.theme?.darkMode ?? { enabled: true },
                        fonts: currentSettings?.theme?.fonts ?? { heading: 'Marcellus', body: 'Marcellus' },
                        borderRadius: currentSettings?.theme?.borderRadius ?? 'md',
                      },
                    })}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={currentSettings?.theme?.colors?.card ?? '#FAFAFA'}
                    onChange={(e) => updateLocal({
                      theme: {
                        ...currentSettings?.theme,
                        preset: currentSettings?.theme?.preset ?? 'magazine',
                        colors: buildColors(currentSettings?.theme?.colors, { card: e.target.value }),
                        darkMode: currentSettings?.theme?.darkMode ?? { enabled: true },
                        fonts: currentSettings?.theme?.fonts ?? { heading: 'Marcellus', body: 'Marcellus' },
                        borderRadius: currentSettings?.theme?.borderRadius ?? 'md',
                      },
                    })}
                    placeholder="#FAFAFA"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Dark Mode */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow visitors to switch to dark mode
                  </p>
                </div>
                <Switch
                  checked={currentSettings?.theme?.darkMode?.enabled ?? true}
                  onCheckedChange={(checked) => updateLocal({
                    theme: {
                      ...currentSettings?.theme,
                      preset: currentSettings?.theme?.preset ?? 'magazine',
                      colors: buildColors(currentSettings?.theme?.colors, {}),
                      darkMode: { ...currentSettings?.theme?.darkMode, enabled: checked },
                      fonts: currentSettings?.theme?.fonts ?? { heading: 'Marcellus', body: 'Marcellus' },
                      borderRadius: currentSettings?.theme?.borderRadius ?? 'md',
                    },
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Layout Style</CardTitle>
              <CardDescription>Choose how your articles are displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Layout Presets */}
                <RadioGroup
                  value={currentSettings?.theme?.preset ?? 'magazine'}
                  onValueChange={(value) => updateLocal({
                    theme: {
                      ...currentSettings?.theme,
                      preset: value as 'magazine' | 'newsletter' | 'minimal',
                      colors: buildColors(currentSettings?.theme?.colors, {}),
                      darkMode: currentSettings?.theme?.darkMode ?? { enabled: true },
                      fonts: currentSettings?.theme?.fonts ?? { heading: 'Marcellus', body: 'Marcellus' },
                      borderRadius: currentSettings?.theme?.borderRadius ?? 'md',
                    },
                  })}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                {Object.entries(themePresets).map(([key, preset]) => (
                  <Label
                    key={key}
                    htmlFor={`layout-${key}`}
                    className={cn(
                      'flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all',
                      currentSettings?.theme?.preset === key
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <RadioGroupItem value={key} id={`layout-${key}`} className="sr-only" />
                    <LayoutPreview preset={key as 'magazine' | 'newsletter' | 'minimal'} />
                    <span className="font-medium mt-3">{preset.name}</span>
                    <span className="text-xs text-muted-foreground text-center mt-1">
                      {preset.description}
                    </span>
                  </Label>
                ))}
              </RadioGroup>

              {/* Border Radius */}
              <div className="space-y-3">
                <Label>Corner Roundness</Label>
                <RadioGroup
                  value={currentSettings?.theme?.borderRadius ?? 'md'}
                  onValueChange={(value) => updateLocal({
                    theme: {
                      ...currentSettings?.theme,
                      preset: currentSettings?.theme?.preset ?? 'magazine',
                      colors: buildColors(currentSettings?.theme?.colors, {}),
                      darkMode: currentSettings?.theme?.darkMode ?? { enabled: true },
                      fonts: currentSettings?.theme?.fonts ?? { heading: 'Marcellus', body: 'Marcellus' },
                      borderRadius: value as 'none' | 'sm' | 'md' | 'lg' | 'full',
                    },
                  })}
                  className="flex gap-4"
                >
                  {['none', 'sm', 'md', 'lg', 'full'].map((radius) => (
                    <Label
                      key={radius}
                      htmlFor={`radius-${radius}`}
                      className="flex items-center gap-2"
                    >
                      <RadioGroupItem value={radius} id={`radius-${radius}`} />
                      <span className="capitalize">{radius === 'full' ? 'Pill' : radius}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero Tab */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Hero Section</CardTitle>
              <CardDescription>Configure your homepage hero area</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable Hero */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Hero Section</Label>
                  <p className="text-sm text-muted-foreground">
                    Display a hero section on your homepage
                  </p>
                </div>
                <Switch
                  checked={currentSettings?.hero?.enabled ?? true}
                  onCheckedChange={(checked) => updateLocal({
                    hero: {
                      ...currentSettings?.hero,
                      enabled: checked,
                      style: currentSettings?.hero?.style ?? 'fullWidth',
                      showSubscribe: currentSettings?.hero?.showSubscribe ?? true,
                    },
                  })}
                />
              </div>

              {currentSettings?.hero?.enabled && (
                <>
                  {/* Hero Title */}
                  <div className="space-y-2">
                    <Label htmlFor="heroTitle">Hero Title</Label>
                    <Input
                      id="heroTitle"
                      value={currentSettings?.hero?.title ?? ''}
                      onChange={(e) => updateLocal({
                        hero: {
                          ...currentSettings?.hero,
                          enabled: true,
                          style: currentSettings?.hero?.style ?? 'fullWidth',
                          showSubscribe: currentSettings?.hero?.showSubscribe ?? true,
                          title: e.target.value,
                        },
                      })}
                      placeholder="Welcome to My Blog"
                    />
                  </div>

                  {/* Hero Subtitle */}
                  <div className="space-y-2">
                    <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                    <Textarea
                      id="heroSubtitle"
                      value={currentSettings?.hero?.subtitle ?? ''}
                      onChange={(e) => updateLocal({
                        hero: {
                          ...currentSettings?.hero,
                          enabled: true,
                          style: currentSettings?.hero?.style ?? 'fullWidth',
                          showSubscribe: currentSettings?.hero?.showSubscribe ?? true,
                          subtitle: e.target.value,
                        },
                      })}
                      placeholder="Subscribe for updates on Bitcoin, freedom, and more."
                      rows={2}
                    />
                  </div>

                  {/* Background Image */}
                  <div className="space-y-2">
                    <Label>Background Image (Optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentSettings?.hero?.backgroundImage ?? ''}
                        onChange={(e) => updateLocal({
                          hero: {
                            ...currentSettings?.hero,
                            enabled: true,
                            style: currentSettings?.hero?.style ?? 'fullWidth',
                            showSubscribe: currentSettings?.hero?.showSubscribe ?? true,
                            backgroundImage: e.target.value,
                          },
                        })}
                        placeholder="https://..."
                        className="flex-1"
                      />
                      <Label
                        htmlFor="hero-upload"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent h-10 px-4 cursor-pointer"
                      >
                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upload'}
                      </Label>
                      <input
                        id="hero-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleHeroImageUpload}
                        disabled={isUploading}
                      />
                    </div>
                    {currentSettings?.hero?.backgroundImage && (
                      <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden border">
                        <img
                          src={currentSettings.hero.backgroundImage}
                          alt="Hero background"
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    )}
                  </div>

                  {/* Show Subscribe */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Subscribe Form</Label>
                      <p className="text-sm text-muted-foreground">
                        Display newsletter signup in the hero
                      </p>
                    </div>
                    <Switch
                      checked={currentSettings?.hero?.showSubscribe ?? true}
                      onCheckedChange={(checked) => updateLocal({
                        hero: {
                          ...currentSettings?.hero,
                          enabled: true,
                          style: currentSettings?.hero?.style ?? 'fullWidth',
                          showSubscribe: checked,
                        },
                      })}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Simple layout preview component
 */
function LayoutPreview({ preset }: { preset: 'magazine' | 'newsletter' | 'minimal' }) {
  if (preset === 'magazine') {
    return (
      <div className="w-full aspect-video bg-muted rounded p-2">
        <div className="grid grid-cols-3 gap-1 h-full">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-background rounded-sm" />
          ))}
        </div>
      </div>
    );
  }

  if (preset === 'newsletter') {
    return (
      <div className="w-full aspect-video bg-muted rounded p-2 flex flex-col gap-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 bg-background rounded-sm flex gap-1 p-1">
            <div className="w-1/4 bg-muted rounded-sm" />
            <div className="flex-1" />
          </div>
        ))}
      </div>
    );
  }

  // Minimal
  return (
    <div className="w-full aspect-video bg-muted rounded p-2 flex flex-col gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-3 bg-background rounded-sm" style={{ width: `${60 + (i % 3) * 10}%` }} />
      ))}
    </div>
  );
}
