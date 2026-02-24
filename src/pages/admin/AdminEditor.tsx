import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useHead } from '@unhead/react';
import { nip19 } from 'nostr-tools';
import { 
  ArrowLeft, 
  Save,
  Eye,
  Upload,
  Loader2,
  FileText,
  Settings,
  Image as ImageIcon,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BlockEditor, htmlToMarkdown, markdownToHtml } from '@/components/editor/BlockEditor';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useArticle } from '@/hooks/useArticles';
import { usePublishArticle, generateSlug } from '@/hooks/usePublishArticle';
import { useUploadFile } from '@/hooks/useUploadFile';
import { useToast } from '@/hooks/useToast';

export function AdminEditor() {
  const { id } = useParams<{ id: string }>();
  const { user } = useCurrentUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Fetch existing article if editing
  const { data: existingArticle, isLoading: isLoadingArticle } = useArticle(
    isEditing ? user?.pubkey : undefined,
    id
  );

  // Hooks
  const { mutateAsync: publishArticle, isPending: isPublishing } = usePublishArticle();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  // Load existing article data
  useEffect(() => {
    if (existingArticle) {
      setTitle(existingArticle.title);
      setSlug(existingArticle.slug);
      setSummary(existingArticle.summary);
      setContent(existingArticle.content);
      setCategory(existingArticle.category ?? '');
      setTags(existingArticle.tags);
      setFeaturedImage(existingArticle.image ?? '');
      setIsFeatured(existingArticle.featured ?? false);
      setSlugEdited(true);
    }
  }, [existingArticle]);

  useHead({
    title: isEditing 
      ? `Edit: ${existingArticle?.title ?? 'Article'} | V4V Blog Admin` 
      : 'New Article | V4V Blog Admin',
  });

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugEdited) {
      setSlug(generateSlug(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlug(value);
    setSlugEdited(true);
  };

  // Handle tag input
  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Handle featured image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const [[, url]] = await uploadFile(file);
      setFeaturedImage(url);
      toast({
        title: 'Image uploaded',
        description: 'Featured image has been uploaded.',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Could not upload image. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Save as draft (placeholder)
  const handleSaveDraft = () => {
    toast({
      title: 'Draft saved',
      description: 'Your article has been saved locally.',
    });
    // TODO: Implement encrypted draft storage using NIP-37
  };

  // Publish article
  const handlePublish = async () => {
    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for your article.',
        variant: 'destructive',
      });
      return;
    }

    if (!slug.trim()) {
      toast({
        title: 'Slug required',
        description: 'Please enter a URL slug for your article.',
        variant: 'destructive',
      });
      return;
    }

    if (!content.trim() && !htmlContent.trim()) {
      toast({
        title: 'Content required',
        description: 'Please write some content for your article.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Convert HTML to markdown for storage
      const markdownContent = htmlContent ? htmlToMarkdown(htmlContent) : content;

      await publishArticle({
        title,
        slug,
        content: markdownContent,
        summary: summary || undefined,
        image: featuredImage || undefined,
        category: category || undefined,
        tags: tags.length > 0 ? tags : undefined,
        featured: isFeatured || undefined,
      });

      toast({
        title: 'Article published!',
        description: 'Your article is now live.',
      });

      // Navigate to the published article
      if (user) {
        const npub = nip19.npubEncode(user.pubkey);
        navigate(`/article/${npub}/${slug}`);
      } else {
        navigate('/admin/articles');
      }
    } catch (error) {
      toast({
        title: 'Publish failed',
        description: 'Could not publish article. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin/articles">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="font-heading text-lg hidden sm:block">
              {isEditing ? 'Edit Article' : 'New Article'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 rounded-full" 
              onClick={handleSaveDraft}
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Save Draft</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 rounded-full"
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Preview</span>
            </Button>
            <Button 
              size="sm" 
              className="gap-2 rounded-full" 
              onClick={handlePublish}
              disabled={isPublishing}
            >
              {isPublishing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Publish'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-5xl py-6">
          <Tabs defaultValue="content" className="space-y-6">
            {/* Tab Navigation */}
            <TabsList className="inline-flex h-10 items-center justify-start rounded-full bg-muted p-1 gap-1">
              <TabsTrigger value="content" className="gap-2 rounded-full px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <FileText className="h-4 w-4" />
                <span>Content</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 rounded-full px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
              <TabsTrigger value="image" className="gap-2 rounded-full px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <ImageIcon className="h-4 w-4" />
                <span>Image</span>
              </TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              {/* Title */}
              <Input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Article title..."
                className="text-3xl md:text-4xl font-heading border-0 px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50"
              />

              {/* TipTap Block Editor */}
              <BlockEditor
                content={existingArticle ? markdownToHtml(existingArticle.content) : ''}
                onChange={setContent}
                onHtmlChange={setHtmlContent}
                placeholder="Start writing your article..."
              />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Article Settings</CardTitle>
                  <CardDescription>
                    Configure your article's metadata and SEO. Fill these in to help readers find your content.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 2-column grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* URL Slug */}
                    <div className="space-y-2">
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        value={slug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        placeholder="my-article-slug"
                      />
                      <p className="text-xs text-muted-foreground">
                        Will be used in the article URL
                      </p>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g., Bitcoin, Podcast, Lifestyle"
                      />
                      <p className="text-xs text-muted-foreground">
                        Main category for this article
                      </p>
                    </div>
                  </div>

                  {/* Summary - full width */}
                  <div className="space-y-2">
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea
                      id="summary"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="A brief description of your article that will appear in previews and search results..."
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Used for SEO, social sharing, and article previews
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add a tag..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <Button type="button" variant="secondary" onClick={handleAddTag}>
                        Add
                      </Button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer hover:bg-destructive/20 transition-colors"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            #{tag} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Click a tag to remove it. Tags help readers discover your content.
                    </p>
                  </div>

                  {/* Featured Article Toggle */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Star className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-0.5">
                        <Label htmlFor="featured" className="text-base font-medium">
                          Featured Article
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Display this article prominently on your homepage
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="featured"
                      checked={isFeatured}
                      onCheckedChange={setIsFeatured}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Image Tab */}
            <TabsContent value="image" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Featured Image</CardTitle>
                  <CardDescription>
                    Add a featured image to make your article stand out. This image appears at the top of your article and in previews.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Upload/URL input */}
                  <div className="space-y-2">
                    <Label>Image URL or Upload</Label>
                    <div className="flex gap-2">
                      <Input
                        value={featuredImage}
                        onChange={(e) => setFeaturedImage(e.target.value)}
                        placeholder="https://..."
                        className="flex-1"
                      />
                      <Label
                        htmlFor="image-upload"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-muted/50 h-10 px-4 py-2 cursor-pointer"
                      >
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        <span className="ml-2">Upload</span>
                      </Label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recommended: 16:9 aspect ratio, at least 1200px wide
                    </p>
                  </div>

                  {/* Image Preview */}
                  {featuredImage ? (
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden border bg-muted">
                        <img
                          src={featuredImage}
                          alt="Featured"
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setFeaturedImage('')}
                        className="mt-2"
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center">
                      <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">
                        No featured image yet. Upload or paste an image URL above.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">{title || 'Untitled'}</DialogTitle>
            {summary && (
              <DialogDescription className="text-base">
                {summary}
              </DialogDescription>
            )}
          </DialogHeader>
          
          {featuredImage && (
            <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden">
              <img
                src={featuredImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          )}

          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent || markdownToHtml(content) }}
          />

          {tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-4 border-t">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
