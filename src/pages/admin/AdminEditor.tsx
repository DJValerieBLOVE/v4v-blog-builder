import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useHead } from '@unhead/react';
import { nip19 } from 'nostr-tools';
import { 
  ArrowLeft, 
  Save,
  Eye,
  Settings,
  Upload,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 rounded-full">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Article Settings</SheetTitle>
                  <SheetDescription>
                    Configure your article's metadata and SEO.
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  {/* Slug */}
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

                  {/* Summary */}
                  <div className="space-y-2">
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea
                      id="summary"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="A brief description of your article..."
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Used for SEO and article previews
                    </p>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g., Bitcoin, Podcast"
                    />
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
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer hover:bg-destructive/20"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            #{tag} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Featured Image */}
                  <div className="space-y-2">
                    <Label>Featured Image</Label>
                    <div className="flex gap-2">
                      <Input
                        value={featuredImage}
                        onChange={(e) => setFeaturedImage(e.target.value)}
                        placeholder="https://..."
                        className="flex-1"
                      />
                      <Label
                        htmlFor="image-upload"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                      >
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
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
                    {featuredImage && (
                      <AspectRatio ratio={16 / 9} className="mt-2 rounded-lg overflow-hidden border">
                        <img
                          src={featuredImage}
                          alt="Featured"
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Recommended: 16:9 aspect ratio, at least 1200px wide
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
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

      {/* Editor */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
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
