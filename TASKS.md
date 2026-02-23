# V4V Blog Builder — Task Tracker

## Current Phase: Not Started

---

## Phase 1: Foundation

### Setup & Routing
- [ ] Update package.json name to "v4v-blog-builder"
- [ ] Add TipTap editor dependencies
- [ ] Add Marcellus font package
- [ ] Configure routes in AppRouter.tsx
- [ ] Create PublicLayout component
- [ ] Create AdminLayout component

### Public Pages
- [ ] Create HomePage component
- [ ] Create ArticlePage component
- [ ] Create CategoryPage component
- [ ] Create TagPage component
- [ ] Create SearchPage component
- [ ] Create AboutPage component

### Components
- [ ] Create Header component (logo, nav, search, login)
- [ ] Create Footer component
- [ ] Create ArticleCard component (16:9 thumbnail)
- [ ] Create ArticleGrid component (magazine layout)
- [ ] Create ArticleList component (newsletter layout)
- [ ] Create ArticleFeed component (minimal layout)
- [ ] Create ArticleView component (full article)
- [ ] Create ArticleMeta component (author, date, tags)
- [ ] Create CategoryNav component
- [ ] Create SearchBar component

### Hooks
- [ ] Create useArticles hook (query kind:30023)
- [ ] Create useArticle hook (single article)
- [ ] Create useCategories hook
- [ ] Create useSearch hook

### SEO
- [ ] Add meta tag generation utility
- [ ] Implement per-article meta tags
- [ ] Add semantic HTML structure

---

## Phase 2: Engagement

### Zap Features
- [ ] Enhance ZapButton for articles
- [ ] Create ZapDisplay component (totals + zappers)
- [ ] Implement anonymous zap flow (QR invoice)
- [ ] Create useArticleZaps hook

### Social Features
- [ ] Create LikeButton component
- [ ] Create RepostButton component
- [ ] Create ShareButton component
- [ ] Create BookmarkButton component
- [ ] Create CommentSection component (kind:1111)
- [ ] Create EngagementBar component

### Hooks
- [ ] Create useArticleEngagement hook
- [ ] Create useArticleComments hook
- [ ] Create useBookmarks hook

---

## Phase 3: Admin & Editor

### Admin Layout
- [ ] Create AdminLayout with sidebar navigation
- [ ] Create AdminDashboard page
- [ ] Create AdminArticles page (list view)
- [ ] Create AdminEditor page
- [ ] Create AdminBookmarks page

### Block Editor
- [ ] Set up TipTap editor foundation
- [ ] Create ParagraphBlock
- [ ] Create HeadingBlock
- [ ] Create ListBlock
- [ ] Create QuoteBlock
- [ ] Create DividerBlock
- [ ] Create ImageBlock (with Blossom upload)
- [ ] Create VideoBlock (auto-detect embeds)
- [ ] Create PodcastBlock (auto-detect embeds)
- [ ] Create LinkCardBlock

### Editor Features
- [ ] Create EditorToolbar component
- [ ] Create ArticleSettings panel (title, slug, category, tags, thumbnail)
- [ ] Create PublishPanel (publish/draft/schedule)
- [ ] Create thumbnail upload (16:9 crop)

### Hooks
- [ ] Create usePublishArticle hook
- [ ] Create useDrafts hook (encrypted kind:31234)
- [ ] Create useSaveDraft hook

### Utilities
- [ ] Create blocks-to-markdown converter
- [ ] Create markdown-to-blocks parser
- [ ] Create embed auto-detection utility

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
