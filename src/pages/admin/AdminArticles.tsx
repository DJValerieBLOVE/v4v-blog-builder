import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useHead } from '@unhead/react';
import { nip19 } from 'nostr-tools';
import { 
  PenSquare, 
  FileText, 
  MoreHorizontal,
  ExternalLink,
  Edit,
  Trash2,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useArticles } from '@/hooks/useArticles';
import { formatShortDate } from '@/lib/article';

export function AdminArticles() {
  const { user } = useCurrentUser();
  const { data: articles, isLoading } = useArticles({
    author: user?.pubkey,
    limit: 100,
  });
  const [searchQuery, setSearchQuery] = useState('');

  useHead({
    title: 'Articles | V4V Blog Admin',
  });

  // Filter articles by search query
  const filteredArticles = useMemo(() => {
    if (!articles) return [];
    if (!searchQuery.trim()) return articles;
    
    const query = searchQuery.toLowerCase();
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.category?.toLowerCase().includes(query) ||
        article.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [articles, searchQuery]);

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl">Articles</h1>
          <p className="text-muted-foreground">
            Manage your published articles
          </p>
        </div>
        <Button asChild className="rounded-full gap-2">
          <Link to="/admin/editor">
            <PenSquare className="h-4 w-4" />
            New Article
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 rounded-full"
        />
      </div>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">
            {searchQuery ? `Search Results (${filteredArticles.length})` : `All Articles (${articles?.length ?? 0})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ArticlesTableSkeleton />
          ) : filteredArticles.length > 0 ? (
            <ArticlesTable articles={filteredArticles} userPubkey={user?.pubkey ?? ''} />
          ) : articles && articles.length > 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No articles match your search</p>
            </div>
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface ArticlesTableProps {
  articles: Array<{
    id: string;
    slug: string;
    title: string;
    category: string | null;
    publishedAt: number;
    tags: string[];
  }>;
  userPubkey: string;
}

function ArticlesTable({ articles, userPubkey }: ArticlesTableProps) {
  const npub = userPubkey ? nip19.npubEncode(userPubkey) : '';

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell>
                <div>
                  <p className="line-clamp-1">{article.title}</p>
                  {article.tags.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {article.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{article.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {article.category ? (
                  <Badge variant="outline">{article.category}</Badge>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatShortDate(article.publishedAt)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/article/${npub}/${article.slug}`} target="_blank">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/admin/editor/${article.slug}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ArticlesTableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-8 rounded" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-6" />
      <h2 className="font-heading text-2xl mb-4">No Articles Yet</h2>
      <p className="text-muted-foreground mb-6">
        Start writing your first article to share with the world.
      </p>
      <Button asChild className="rounded-full">
        <Link to="/admin/editor">Create Your First Article</Link>
      </Button>
    </div>
  );
}
