# V4V Blog Builder — Task Tracker

## Current Phase: All Phases Complete! ✅

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

## Phase 4: Theme System ✅ COMPLETE

### Theme Infrastructure
- [x] Create BlogSettingsProvider context
- [x] Create BlogSettings types (identity, theme, hero, newsletter)
- [x] Create useBlogSettings hook (kind:30078)
- [x] Create useUpdateBlogSettings hook

### Theme Presets
- [x] Create Magazine theme preset
- [x] Create Newsletter theme preset
- [x] Create Minimal theme preset
- [x] Create color presets (purple, blue, green, orange, pink, red)

### Settings UI
- [x] Create ThemeSettings component with tabs
- [x] Create Identity settings (blog name, tagline, logo)
- [x] Create Theme settings (color picker, dark mode toggle)
- [x] Create Layout picker with visual previews
- [x] Create Hero settings (title, subtitle, background image)
- [x] Create logo upload/text toggle
- [x] Create border radius options

### Integration
- [x] Integrate ThemeSettings into AdminSettings
- [x] Implement CSS variable injection via BlogSettingsProvider
- [x] Create hexToHsl utility for color conversion

---

## Phase 5: Newsletter & Hero ✅ COMPLETE

### Hero Section
- [x] Create HeroSection component with blog settings integration
- [x] Create fullWidth hero variant
- [x] Create split hero variant
- [x] Create minimal hero variant
- [x] Create SubscribeForm component (inline, stacked, minimal variants)
- [x] Create NostrFollowButton component with copy/share dialog

### Newsletter Integration
- [x] Create useNewsletterSubmit hook with provider dispatching
- [x] Newsletter settings integrated into theme settings

### Provider Integrations
- [x] Implement Mailchimp integration (via CORS proxy)
- [x] Implement ConvertKit integration (direct API)
- [x] Implement Buttondown integration (via CORS proxy)
- [x] Implement Beehiiv integration (via CORS proxy)
- [x] Implement generic webhook option

### HomePage Updates
- [x] Integrate HeroSection with blog settings
- [x] Update HomePage to use layout-specific article display
- [x] Wrap PublicLayout with BlogSettingsProvider

---

## Phase 6: Polish & SEO ✅ COMPLETE

### SEO
- [x] Add JSON-LD structured data to ArticlePage
- [x] Create generateArticleJsonLd utility
- [x] Generate comprehensive Open Graph meta tags
- [x] Add article:published_time, article:author, article:tag meta

### UX
- [x] Loading skeletons for all async content (articles, comments, etc.)
- [x] Empty states for all content sections
- [x] Error boundaries configured at app level
- [x] All components mobile responsive with Tailwind breakpoints

### Final Polish
- [x] Polish 404 page with elegant design
- [x] "Vibed with Shakespeare" link in footer
- [x] All routes tested and working

---

## Post-Phase Polish ✅ COMPLETE

### Typography & Sizing
- [x] Set base font size to 18px
- [x] Marcellus font for ALL text (headings and body)
- [x] Header navigation text size 18px (text-base)
- [x] Footer text size 16px
- [x] Button heights reduced (h-8 default, h-7 sm, h-9 lg)
- [x] Button horizontal padding increased (px-5 default, px-4 sm, px-8 lg)

### Color System
- [x] Change default theme from pink to neutral dark gray (#2D2D2D)
- [x] Add full color customization in Theme Settings:
  - [x] Button & Accent Color picker
  - [x] Background Color picker
  - [x] Text Color picker
  - [x] Card Background Color picker
- [x] Apply all custom colors via CSS variables
- [x] Keep quick color presets (purple, blue, green, orange, pink, red)

### UI Fixes
- [x] Hero badge: border outline instead of light pink background
- [x] Hero badge: lightning bolt icon instead of sparkles
- [x] Hero text: "Build Your Value for Value Blog"
- [x] Hero subtitle: "Own your content. Get paid in Bitcoin."
- [x] Default border radius: 'md' instead of 'full' (pill)
- [x] Subscribe form inputs/buttons: keep pill shape (rounded-full)
- [x] Remove light pink hover states from outline/ghost buttons

---

## Phase 7: RSS & Import (PRIORITY - Next)

### RSS Feed Generation
- [ ] Create RSS feed endpoint/generator
- [ ] Add RSS auto-discovery meta tag
- [ ] Include proper schema for blog authority

### RSS Import
- [ ] Parse RSS/Atom feed URLs
- [ ] Extract title, content, date, images
- [ ] Convert to NIP-23 articles
- [ ] Review/edit before publishing to Nostr

---

## Phase 8: AI Writing Assistant (Future)

- [ ] AI assistant panel in editor sidebar
- [ ] User API key input (stored in localStorage)
- [ ] Generate/improve article content
- [ ] SEO title and summary suggestions
- [ ] Tag and category suggestions
- [ ] Readability improvements

---

## Summary

Phases 1-6 complete. Post-phase polish complete.

**Next Priority**: Phase 7 (RSS Feed Generation & Import) - Critical for SEO/AI authority

---

## Recent Updates (February 2026)

### UI/UX Improvements ✅
- [x] Add "New Article" button in header for logged-in users
- [x] Fix footer background color (use white/background)
- [x] Fix dropdown menu accent colors (was dark on dark)
- [x] Strip ** markdown artifacts from article content
- [x] Make article cards have white background
- [x] Show category and 1 tag instead of reading time on cards
- [x] Spread out action icons under posts
- [x] Add zap button at top of article (next to author info)
- [x] Make comments section togglable (click to show/hide)

### TypeScript Fixes ✅
- [x] Fix ThemeSettings color type mismatches
- [x] Fix ZapButton props (support both `target` and `event`)
- [x] Fix CommentSection `replyTo` → `reply` property
- [x] Fix BlockEditor markdown storage fallback
- [x] Fix ArticleCard formatShortDate import

---

## Design Notes

- All thumbnails use 16:9 ratio
- Marcellus font for ALL text (no bold, weight 400)
- Pill-shaped subscribe form (email input + button)
- Neutral default theme (users customize via settings)
- Settings stored in kind:30078 (public, syncs across devices)
- Theme presets: Magazine, Newsletter, Minimal
- Color presets: Purple, Blue, Green, Orange, Pink, Red
- Full color customization: accent, background, text, card colors
