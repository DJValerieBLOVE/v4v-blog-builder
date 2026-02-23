import { Link } from 'react-router-dom';
import { useHead } from '@unhead/react';
import { 
  FileText, 
  PenSquare, 
  Zap, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useArticles } from '@/hooks/useArticles';
import { ArticleCard, ArticleCardSkeleton } from '@/components/blog/ArticleCard';

export function AdminDashboard() {
  const { user } = useCurrentUser();
  const { data: articles, isLoading } = useArticles({
    author: user?.pubkey,
    limit: 5,
  });

  useHead({
    title: 'Dashboard | V4V Blog Admin',
  });

  const stats = [
    {
      title: 'Published Articles',
      value: articles?.length ?? 0,
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Zaps',
      value: '0 sats',
      icon: Zap,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Views This Week',
      value: '-',
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
        </div>
        <Button asChild className="rounded-full gap-2">
          <Link to="/admin/editor">
            <PenSquare className="h-4 w-4" />
            New Article
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Articles */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading">Recent Articles</CardTitle>
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link to="/admin/articles">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <ArticleCardSkeleton key={i} layout="list" />
              ))}
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="space-y-4">
              {articles.slice(0, 3).map((article) => (
                <ArticleCard key={article.id} article={article} layout="list" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-4">No articles yet</p>
              <Button asChild className="rounded-full">
                <Link to="/admin/editor">Create Your First Article</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
              <Link to="/admin/editor">
                <PenSquare className="h-6 w-6" />
                <span>Write New Article</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
              <Link to="/admin/articles">
                <FileText className="h-6 w-6" />
                <span>Manage Articles</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
              <Link to="/admin/settings">
                <Zap className="h-6 w-6" />
                <span>Lightning Settings</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
              <Link to="/" target="_blank">
                <TrendingUp className="h-6 w-6" />
                <span>View Blog</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
