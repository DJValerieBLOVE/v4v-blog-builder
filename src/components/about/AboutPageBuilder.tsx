import { useState } from 'react';
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  Upload,
  Loader2,
  Check,
  User,
  FileText,
  Target,
  Mail,
  Share2,
  ImageIcon,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBlogSettings, useUpdateBlogSettings } from '@/hooks/useBlogSettings';
import { useUploadFile } from '@/hooks/useUploadFile';
import { useToast } from '@/hooks/useToast';
import { useAuthor } from '@/hooks/useAuthor';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useBlogSettingsContext } from '@/components/theme/BlogSettingsProvider';
import type { AboutSection, AboutSectionType, BlogSettings } from '@/lib/blogSettings';
import { cn } from '@/lib/utils';

const sectionTypes: { type: AboutSectionType; label: string; icon: React.ReactNode; description: string }[] = [
  { type: 'hero', label: 'Hero Banner', icon: <ImageIcon className="h-4 w-4" />, description: 'Large intro section with title and description' },
  { type: 'writer', label: 'About Writer', icon: <User className="h-4 w-4" />, description: 'Photo, name, and bio of the author' },
  { type: 'text', label: 'Text Block', icon: <FileText className="h-4 w-4" />, description: 'Custom text content section' },
  { type: 'mission', label: 'Mission', icon: <Target className="h-4 w-4" />, description: 'Your blog\'s mission or purpose' },
  { type: 'contact', label: 'Contact Info', icon: <Mail className="h-4 w-4" />, description: 'Lightning, website, and Nostr info' },
  { type: 'social', label: 'Social Links', icon: <Share2 className="h-4 w-4" />, description: 'Links to your social profiles' },
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function AboutPageBuilder() {
  const { user } = useCurrentUser();
  const author = useAuthor(user?.pubkey);
  const metadata = author.data?.metadata;
  const { settings: blogSettings } = useBlogSettingsContext();
  const { mutateAsync: updateSettings, isPending: isSaving } = useUpdateBlogSettings();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();
  const { toast } = useToast();

  // Local state for sections
  const [sections, setSections] = useState<AboutSection[]>(
    blogSettings?.about?.sections ?? []
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const updateSections = (newSections: AboutSection[]) => {
    setSections(newSections);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await updateSettings({ about: { sections } });
      toast({ title: 'About page saved!' });
      setHasChanges(false);
    } catch {
      toast({ title: 'Failed to save', variant: 'destructive' });
    }
  };

  const addSection = (type: AboutSectionType) => {
    const newSection: AboutSection = {
      id: generateId(),
      type,
      enabled: true,
      title: sectionTypes.find(s => s.type === type)?.label ?? 'New Section',
    };
    
    if (type === 'contact') {
      newSection.showLightning = true;
      newSection.showWebsite = true;
      newSection.showNpub = true;
    }
    
    updateSections([...sections, newSection]);
  };

  const removeSection = (id: string) => {
    updateSections(sections.filter(s => s.id !== id));
  };

  const toggleSection = (id: string) => {
    updateSections(sections.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const updateSection = (id: string, updates: Partial<AboutSection>) => {
    updateSections(sections.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newSections = [...sections];
    const [removed] = newSections.splice(draggedIndex, 1);
    newSections.splice(index, 0, removed);
    setSections(newSections);
    setDraggedIndex(index);
    setHasChanges(true);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleImageUpload = async (sectionId: string, field: 'image' | 'writerPhoto') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const [[, url]] = await uploadFile(file);
        updateSection(sectionId, { [field]: url });
        toast({ title: 'Image uploaded' });
      } catch {
        toast({ title: 'Upload failed', variant: 'destructive' });
      }
    };
    input.click();
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr,400px] gap-6">
      {/* Left: Section Editor */}
      <div className="space-y-4">
        {/* Save Bar */}
        {hasChanges && (
          <div className="sticky top-0 z-10 flex items-center justify-between p-3 bg-white dark:bg-zinc-900 border rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">You have unsaved changes</p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSections(blogSettings?.about?.sections ?? []);
                  setHasChanges(false);
                }}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {/* Sections */}
        <div className="space-y-3">
          {sections.map((section, index) => (
            <Card 
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                'transition-all',
                draggedIndex === index && 'opacity-50 scale-[0.98]',
                !section.enabled && 'opacity-60'
              )}
            >
              <CardHeader className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {sectionTypes.find(s => s.type === section.type)?.icon}
                      <span className="font-medium">{section.title || sectionTypes.find(s => s.type === section.type)?.label}</span>
                      <Badge variant="outline" className="text-xs">{section.type}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleSection(section.id)}
                  >
                    {section.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeSection(section.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              {section.enabled && (
                <CardContent className="pt-0 pb-4 px-4">
                  <SectionEditor 
                    section={section} 
                    onChange={(updates) => updateSection(section.id, updates)}
                    onImageUpload={(field) => handleImageUpload(section.id, field)}
                    isUploading={isUploading}
                    metadata={metadata}
                  />
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Add Section */}
        <Card className="border-dashed">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground mr-2">Add section:</span>
              {sectionTypes.map((type) => (
                <Button
                  key={type.type}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => addSection(type.type)}
                >
                  {type.icon}
                  {type.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: Live Preview */}
      <div className="hidden xl:block">
        <div className="sticky top-4">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Live Preview</span>
          </div>
          <AboutPreview sections={sections} metadata={metadata} blogSettings={blogSettings} />
        </div>
      </div>
    </div>
  );
}

interface SectionEditorProps {
  section: AboutSection;
  onChange: (updates: Partial<AboutSection>) => void;
  onImageUpload: (field: 'image' | 'writerPhoto') => void;
  isUploading: boolean;
  metadata?: { name?: string; picture?: string; about?: string; website?: string; lud16?: string };
}

function SectionEditor({ section, onChange, onImageUpload, isUploading, metadata }: SectionEditorProps) {
  switch (section.type) {
    case 'hero':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={section.title ?? ''} 
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="About This Blog"
              />
            </div>
            <div className="space-y-2">
              <Label>Background Image</Label>
              <div className="flex gap-2">
                <Input 
                  value={section.image ?? ''} 
                  onChange={(e) => onChange({ image: e.target.value })}
                  placeholder="https://..."
                  className="flex-1"
                />
                <Button variant="outline" size="icon" onClick={() => onImageUpload('image')} disabled={isUploading}>
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              value={section.content ?? ''} 
              onChange={(e) => onChange({ content: e.target.value })}
              placeholder="Tell visitors what your blog is about..."
              rows={3}
            />
          </div>
        </div>
      );

    case 'writer':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input 
                value={section.title ?? ''} 
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="Meet the Writer"
              />
            </div>
            <div className="space-y-2">
              <Label>Your Name</Label>
              <Input 
                value={section.writerName ?? ''} 
                onChange={(e) => onChange({ writerName: e.target.value })}
                placeholder={metadata?.name ?? 'Your name'}
              />
              <p className="text-xs text-muted-foreground">Leave blank to use Nostr profile</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={section.writerPhoto ?? metadata?.picture} />
                <AvatarFallback>{(section.writerName ?? metadata?.name)?.[0]?.toUpperCase() ?? '?'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Input 
                  value={section.writerPhoto ?? ''} 
                  onChange={(e) => onChange({ writerPhoto: e.target.value })}
                  placeholder={metadata?.picture ?? 'https://...'}
                  className="flex-1"
                />
                <Button variant="outline" size="icon" onClick={() => onImageUpload('writerPhoto')} disabled={isUploading}>
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea 
              value={section.writerBio ?? ''} 
              onChange={(e) => onChange({ writerBio: e.target.value })}
              placeholder={metadata?.about ?? 'Tell readers about yourself...'}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">Leave blank to use Nostr profile bio</p>
          </div>
        </div>
      );

    case 'text':
    case 'mission':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input 
              value={section.title ?? ''} 
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder={section.type === 'mission' ? 'Our Mission' : 'Section Title'}
            />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea 
              value={section.content ?? ''} 
              onChange={(e) => onChange({ content: e.target.value })}
              placeholder="Write your content here..."
              rows={4}
            />
          </div>
        </div>
      );

    case 'contact':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input 
              value={section.title ?? ''} 
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Get in Touch"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Show Lightning Address</Label>
              <Switch 
                checked={section.showLightning ?? true}
                onCheckedChange={(checked) => onChange({ showLightning: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Show Website</Label>
              <Switch 
                checked={section.showWebsite ?? true}
                onCheckedChange={(checked) => onChange({ showWebsite: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Show Nostr Public Key</Label>
              <Switch 
                checked={section.showNpub ?? true}
                onCheckedChange={(checked) => onChange({ showNpub: checked })}
              />
            </div>
          </div>
        </div>
      );

    case 'social':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input 
              value={section.title ?? ''} 
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Follow Me"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Social links are pulled from your Nostr profile metadata.
          </p>
        </div>
      );

    default:
      return null;
  }
}

interface AboutPreviewProps {
  sections: AboutSection[];
  metadata?: { name?: string; picture?: string; about?: string; website?: string; lud16?: string };
  blogSettings: BlogSettings;
}

function AboutPreview({ sections, metadata, blogSettings }: AboutPreviewProps) {
  const enabledSections = sections.filter(s => s.enabled);

  return (
    <div className="bg-background border rounded-lg overflow-hidden text-sm">
      {/* Mini header */}
      <div className="px-4 py-2 border-b bg-card flex items-center justify-between">
        <span className="font-medium text-xs">{blogSettings.identity.blogName}</span>
        <span className="text-xs text-muted-foreground">About</span>
      </div>

      {/* Sections */}
      <div className="divide-y">
        {enabledSections.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>Add sections to build your About page</p>
          </div>
        ) : (
          enabledSections.map((section) => (
            <div key={section.id} className="p-4">
              {section.type === 'hero' && (
                <div 
                  className="rounded-lg p-4 text-center"
                  style={{
                    backgroundImage: section.image ? `url(${section.image})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: section.image ? undefined : 'hsl(var(--muted))',
                  }}
                >
                  {section.image && <div className="absolute inset-0 bg-black/40 rounded-lg" />}
                  <div className="relative">
                    <h2 className="font-heading text-base mb-1" style={{ color: section.image ? 'white' : undefined }}>
                      {section.title || 'About This Blog'}
                    </h2>
                    <p className="text-xs" style={{ color: section.image ? 'rgba(255,255,255,0.8)' : 'hsl(var(--muted-foreground))' }}>
                      {section.content || 'Your blog description here...'}
                    </p>
                  </div>
                </div>
              )}

              {section.type === 'writer' && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">{section.title || 'Meet the Writer'}</p>
                  <Avatar className="h-12 w-12 mx-auto mb-2">
                    <AvatarImage src={section.writerPhoto ?? metadata?.picture} />
                    <AvatarFallback className="text-sm">
                      {(section.writerName ?? metadata?.name)?.[0]?.toUpperCase() ?? '?'}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-medium text-sm">{section.writerName || metadata?.name || 'Your Name'}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {section.writerBio || metadata?.about || 'Your bio here...'}
                  </p>
                </div>
              )}

              {(section.type === 'text' || section.type === 'mission') && (
                <div>
                  <p className="font-medium text-sm mb-1">{section.title}</p>
                  <p className="text-xs text-muted-foreground">{section.content || 'Your content here...'}</p>
                </div>
              )}

              {section.type === 'contact' && (
                <div>
                  <p className="font-medium text-sm mb-2">{section.title || 'Get in Touch'}</p>
                  <div className="space-y-1 text-xs">
                    {section.showLightning && metadata?.lud16 && (
                      <p className="text-muted-foreground truncate">Lightning: {metadata.lud16}</p>
                    )}
                    {section.showWebsite && metadata?.website && (
                      <p className="text-muted-foreground truncate">Web: {metadata.website}</p>
                    )}
                    {section.showNpub && (
                      <p className="text-muted-foreground">npub: npub1...</p>
                    )}
                  </div>
                </div>
              )}

              {section.type === 'social' && (
                <div className="text-center">
                  <p className="font-medium text-sm mb-2">{section.title || 'Follow Me'}</p>
                  <div className="flex justify-center gap-2">
                    <div className="h-6 w-6 rounded bg-muted" />
                    <div className="h-6 w-6 rounded bg-muted" />
                    <div className="h-6 w-6 rounded bg-muted" />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
