import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";

// Layouts
import { PublicLayout } from "./components/layout/PublicLayout";
import { AdminLayout } from "./components/layout/AdminLayout";

// Public Pages
import { HomePage } from "./pages/public/HomePage";
import { ArticlePage } from "./pages/public/ArticlePage";
import { CategoryPage } from "./pages/public/CategoryPage";
import { TagPage } from "./pages/public/TagPage";
import { SearchPage } from "./pages/public/SearchPage";
import { AboutPage } from "./pages/public/AboutPage";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminArticles } from "./pages/admin/AdminArticles";
import { AdminEditor } from "./pages/admin/AdminEditor";
import { AdminBookmarks } from "./pages/admin/AdminBookmarks";
import { AdminSettings } from "./pages/admin/AdminSettings";

// Utility Pages
import { NIP19Page } from "./pages/NIP19Page";
import NotFound from "./pages/NotFound";

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes with PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:npub/:slug" element={<ArticlePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/tag/:tag" element={<TagPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>

        {/* Admin Routes with AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="editor" element={<AdminEditor />} />
          <Route path="editor/:id" element={<AdminEditor />} />
          <Route path="bookmarks" element={<AdminBookmarks />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* NIP-19 route for npub1, note1, naddr1, nevent1, nprofile1 */}
        <Route path="/:nip19" element={<NIP19Page />} />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRouter;