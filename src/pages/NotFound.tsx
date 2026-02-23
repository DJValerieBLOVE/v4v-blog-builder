import { useSeoMeta } from "@unhead/react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { FileQuestion, Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useSeoMeta({
    title: "404 - Page Not Found | V4V Blog",
    description: "The page you are looking for could not be found. Return to the home page to continue browsing.",
  });

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container max-w-lg text-center px-4">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-150" />
          <div className="relative flex items-center justify-center">
            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <FileQuestion className="h-16 w-16 text-primary" />
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="font-heading text-6xl md:text-7xl mb-4 text-foreground">
          404
        </h1>
        <h2 className="font-heading text-2xl md:text-3xl mb-4 text-foreground">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Sorry, we couldn't find the page you're looking for. 
          It might have been moved or deleted.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full gap-2">
            <Link to="/search">
              <Search className="h-4 w-4" />
              Search Articles
            </Link>
          </Button>
        </div>

        {/* Back link */}
        <div className="mt-8">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back to previous page
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
