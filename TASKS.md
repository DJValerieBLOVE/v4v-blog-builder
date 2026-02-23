# V4V Blog Builder — Task Tracker

## Current Phase: Phase 3 Complete - Moving to Phase 4

---

## Phase 1: Foundation ✅ COMPLETE

### Setup & Routing
- [x] Update package.json name to "v4v-blog-builder"
- [x] Add Marcellus font package
- [x] Configure routes in AppRouter.tsx
- [x] Create PublicLayout component
- [x] Create AdminLayout component

### Public Pages
- [x] Create HomePage component
- [x] Create ArticlePage component
- [x] Create CategoryPage component
- [x] Create TagPage component
- [x] Create SearchPage component
- [x] Create AboutPage component

### Admin Pages
- [x] Create AdminDashboard component
- [x] Create AdminArticles component
- [x] Create AdminEditor component (basic - TipTap in Phase 3)
- [x] Create AdminBookmarks component
- [x] Create AdminSettings component

### Components
- [x] Create Header component (logo, nav, search, login)
- [x] Create Footer component
- [x] Create ArticleCard component (16:9 thumbnail)
- [x] Create ArticleGrid component (magazine layout)
- [x] Create ArticleList component (newsletter layout)
- [x] Create ArticleFeed component (minimal layout)
- [x] Create ArticleView component (full article)
- [x] Create ArticleMeta component (author, date, tags)
- [x] Create CategoryNav component
- [x] Create SearchBar component

### Hooks
- [x] Create useArticles hook (query kind:30023)
- [x] Create useArticle hook (single article)
- [x] Create useSearchArticles hook

### SEO
- [x] Add meta tag generation with @unhead/react
- [x] Implement per-article meta tags
- [x] Add semantic HTML structure

### Utilities
- [x] Create article.ts utility (parseArticle, validateArticle, etc.)

---

## Phase 2: Engagement ✅ COMPLETE

### Zap Features
- [x] Integrate existing ZapButton for articles
- [x] Create ZapDisplay component (totals + zappers)
- [x] Use existing zap flow with QR invoice support

### Social Features
- [x] Create LikeButton component (kind:7 reactions)
- [x] Create RepostButton component (kind:16 generic reposts)
- [x] Create ShareButton component (copy link, Twitter, native share)
- [x] Create BookmarkButton component (NIP-51 kind:10003)
- [x] Create CommentSection component (kind:1111 with threading)
- [x] Create EngagementBar component (horizontal/vertical/compact layouts)

### Hooks
- [x] Create useArticleEngagement hook (combined query for all engagement types)
- [x] Use existing useComments hook for article comments
- [x] Create useBookmarks hook (NIP-51 public bookmarks)
- [x] Create useToggleBookmark hook
- [x] Create useHasLiked and useHasReposted hooks

### Integration
- [x] Integrate EngagementBar into ArticleView
- [x] Integrate CommentSection into ArticleView

---

## Phase 3: Admin & Editor ✅ COMPLETE

### Admin Layout (Done in Phase 1)
- [x] Create AdminLayout with sidebar navigation
- [x] Create AdminDashboard page
- [x] Create AdminArticles page (list view)
- [x] Create AdminEditor page
- [x] Create AdminBookmarks page

### Block Editor
- [x] Set up TipTap editor foundation (StarterKit)
- [x] Configure heading extension (h1, h2, h3)
- [x] Configure list extensions (bullet, ordered)
- [x] Configure blockquote extension
- [x] Configure horizontal rule extension
- [x] Configure image extension (with Blossom upload)
- [x] Configure YouTube embed extension
- [x] Configure link extension
- [x] Configure placeholder extension

### Editor Features
- [x] Create EditorToolbar component with all formatting tools
- [x] Create ArticleSettings panel (title, slug, category, tags, thumbnail)
- [x] Create image upload dialog (URL + file upload)
- [x] Create link dialog
- [x] Create YouTube embed dialog
- [x] Create preview dialog
- [x] Create featured image upload (16:9 with Blossom)

### Hooks
- [x] Create usePublishArticle hook (kind:30023)
- [x] Create generateSlug utility

### Utilities
- [x] Create htmlToMarkdown converter
- [x] Create markdownToHtml converter
- [x] Create editor.css for TipTap styling

---

## Phase 4: Theme System

### Theme Infrastructure
- [ ] Create ThemeContext/Provider
- [ ] Create theme configuration types
- [ ] Create useBlogSettings hook (kind:30078)

### Theme Presets
- [ ] Create Magazine theme preset
- [ ] Create Newsletter theme preset
- [ ] Create Minimal theme preset

### Settings UI
- [ ] Create ThemeSettings page
- [ ] Create layout picker component
- [ ] Create color customization component
- [ ] Create font selector component
- [ ] Create logo upload/text toggle
- [ ] Create hero settings component
- [ ] Create dark mode toggle
- [ ] Create live theme preview

### Apply Themes
- [ ] Implement theme CSS variable injection
- [ ] Update all components to use theme variables
- [ ] Test all three layouts

---

## Phase 5: Newsletter & Hero

### Hero Section
- [ ] Create HeroSection component
- [ ] Create hero style variants (fullWidth, split, minimal)
- [ ] Create SubscribeForm component
- [ ] Create NostrFollowButton component

### Newsletter Integration
- [ ] Create NewsletterSettings UI
- [ ] Create provider selection dropdown
- [ ] Create API key/config fields per provider
- [ ] Create useNewsletterSubmit hook

### Provider Integrations
- [ ] Implement Mailchimp integration
- [ ] Implement ConvertKit integration
- [ ] Implement Buttondown integration
- [ ] Implement Beehiiv integration
- [ ] Implement generic webhook option

---

## Phase 6: Polish & SEO

### SEO
- [ ] Add JSON-LD structured data
- [ ] Generate Open Graph meta tags
- [ ] Create sitemap generation
- [ ] Configure robots.txt

### Performance
- [ ] Audit and optimize bundle size
- [ ] Add image lazy loading
- [ ] Optimize re-renders

### UX
- [ ] Add loading skeletons for all async content
- [ ] Add empty states for no content
- [ ] Add error states and error boundaries
- [ ] Mobile responsiveness audit
- [ ] Accessibility audit (ARIA, keyboard nav)

### Final Polish
- [ ] Polish 404 page
- [ ] Add "Vibed with Shakespeare" footer link
- [ ] Test full user flows
- [ ] Documentation/README update

---

## Completed Tasks

(Move tasks here when done)

---

## Notes

- All thumbnails should be 16:9 ratio
- Marcellus font for headings (no bold)
- Large rounded buttons throughout
- Elegant/luxury aesthetic
- Settings stored in kind:30078 (public, syncs across devices)
- Support for private relay (Railway) in future
