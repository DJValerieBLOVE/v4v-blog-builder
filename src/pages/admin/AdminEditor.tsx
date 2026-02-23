import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useHead } from '@unhead/react';
import { 
  ArrowLeft, 
  Save,
  Eye,
  Settings,
  Image,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Minus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useArticle } from '@/hooks/useArticles';
import { useToast } from '@/hooks/useToast';

export function AdminEditor() {
  const { id } = useParams<{ id: string }>();
  const { user } = useCurrentUser();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  // Fetch existing article if editing
  const { data: existingArticle, isLoading } = useArticle(
    isEditing ? user?.pubkey : undefined,
    id
  );

  // Form state
  const [title, setTitle] = useState(existingArticle?.title ?? '');
  const [slug, setSlug] = useState(existingArticle?.slug ?? '');
  const [summary, setSummary] = useState(existingArticle?.summary ?? '');
  const [content, setContent] = useState(existingArticle?.content ?? '');
  const [category, setCategory] = useState(existingArticle?.category ?? '');
  const [tags, setTags] = useState<string[]>(existingArticle?.tags ?? []);
  const [featuredImage, setFeaturedImage] = useState(existingArticle?.image ?? '');
  const [tagInput, setTagInput] = useState('');

  useHead({
    title: isEditing ? `Edit: ${existingArticle?.title ?? 'Article'} | V4V Blog Admin` : 'New Article | V4V Blog Admin',
  });

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing && !slug) {
      setSlug(
        value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
      );
    }
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

  // Save as draft (placeholder)
  const handleSaveDraft = () => {
    toast({
      title: 'Draft saved',
      description: 'Your article has been saved as a draft.',
    });
  };

  // Publish (placeholder)
  const handlePublish = () => {
    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for your article.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Article published',
      description: 'Your article is now live!',
    });
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
            <Button variant="outline" size="sm" className="gap-2 rounded-full" onClick={handleSaveDraft}>
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Save Draft</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2 rounded-full">
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
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="my-article-slug"
                    />
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
                            className="cursor-pointer"
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
                    <Label htmlFor="featuredImage">Featured Image URL</Label>
                    <Input
                      id="featuredImage"
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      placeholder="https://..."
                    />
                    {featuredImage && (
                      <div className="mt-2 rounded-lg overflow-hidden border aspect-video">
                        <img
                          src={featuredImage}
                          alt="Featured"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Button size="sm" className="gap-2 rounded-full" onClick={handlePublish}>
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Title */}
          <div>
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Article title..."
              className="text-3xl md:text-4xl font-heading border-0 px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-1 border rounded-lg p-1 bg-muted/50">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Italic className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Heading2 className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Quote className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Image className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Minus className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <Card>
            <CardContent className="pt-6">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here...

You can use Markdown formatting:
- **bold** and *italic* text
- # Headings
- Lists and blockquotes
- [Links](url) and images

The full TipTap block editor is coming soon!"
                className="min-h-[500px] border-0 resize-none focus-visible:ring-0 text-base"
              />
            </CardContent>
          </Card>

          {/* Help Text */}
          <p className="text-center text-sm text-muted-foreground">
            Tip: Use Markdown formatting for rich text. The full block editor with embeds is coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
