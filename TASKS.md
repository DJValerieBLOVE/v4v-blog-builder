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

### Blog Owner System ✅
- [x] Create `src/lib/blogOwner.ts` with owner pubkey config
- [x] Create `useBlogOwner` hook for owner status checks
- [x] Update AdminLayout - only owner can access admin
- [x] Show "Access Denied" page for non-owners trying to access /admin
- [x] Hide "New Article" button from non-owners in Header
- [x] Add Dashboard icon button for owners in Header
- [x] Add "Builder Mode" warning banner when no owner configured
- [x] Visitors can still login to comment/zap (not blocked)

---

## Phase 6.7: Theme & Editor UX ✅ COMPLETE

### Theme Settings Improvements
- [x] Color preset circles reduced to small bubbles (w-6 h-6)
- [x] Theme tabs changed to bubble/pill style (not full width)
- [x] 2-column layout for all settings sections
- [x] Featured post layout in Magazine theme (Ghost-style hero card)
- [x] Live site preview panel in Theme Settings

---

## Phase 6.8: Article Editor ✅ COMPLETE

### Article Editor Improvements
- [x] Removed slide-out sheet for article settings
- [x] Added inline tabs: Content, Settings, Image
- [x] Settings tab shows slug, category, summary, tags in card layout
- [x] Image tab shows featured image upload with preview
- [x] All settings visible without opening anything

---

## Phase 6.9: About Page Builder ✅ COMPLETE

### Visual Builder
- [x] Created AboutPageBuilder component with drag-and-drop
- [x] Section types: Hero, Writer, Text, Mission, Contact, Social
- [x] Drag handle for reordering sections
- [x] Enable/disable toggle for each section
- [x] Delete button to remove sections
- [x] Add section buttons for each type

### Section Editors
- [x] Hero section: title, description, background image
- [x] Writer section: name, photo, bio (falls back to Nostr)
- [x] Text/Mission sections: title and content
- [x] Contact section: toggles for Lightning, website, npub
- [x] Social section: placeholder for future links

### Live Preview
- [x] Real-time preview panel on right side (xl screens)
- [x] Preview updates as you edit
- [x] Shows enabled sections only

### UI Fixes
- [x] Fixed settings tabs visibility (white background, pill style)
- [x] Active tab now uses primary color
- [x] Tabs have proper contrast on any background

---

## Phase 6.10: Featured Articles & UI Polish ✅ COMPLETE

### Settings Layout
- [x] Changed Theme Settings to 50/50 split layout (lg:grid-cols-2)
- [x] Preview panel now gets full 50% width instead of fixed 320px
- [x] Better use of horizontal space on wide screens

### Featured Articles in Previews
- [x] Magazine layout: Featured article already existed (hero card style)
- [x] Newsletter layout: Added featured article section with badge
- [x] Minimal layout: Added featured article with badge indicator

### Article Editor Featured Toggle
- [x] Added "Featured Article" toggle switch in Settings tab
- [x] Star icon indicator for featured status
- [x] Featured flag passed to usePublishArticle hook
- [x] Featured status loaded when editing existing articles

### Data Model Updates
- [x] Added `featured: boolean` to ArticleData interface
- [x] Added `featured?: boolean` to ArticleInput interface  
- [x] parseArticle extracts featured flag from tags
- [x] usePublishArticle adds `["featured", "true"]` tag when enabled

---

## Phase 6.11: Critical Bug Fixes ✅ COMPLETE

### useZaps.ts TypeScript Error (PERMANENTLY FIXED)
- [x] **ROOT CAUSE #1**: Line 215 was passing `actualTarget.id` (string) to `nip57.makeZapRequest`
- [x] **ROOT CAUSE #2**: Using `profile` property which doesn't exist in nostr-tools types
- [x] **nostr-tools nip57 API has TWO types**:
  - `ProfileZap`: `{ pubkey, amount, comment?, relays }` - for zapping profiles
  - `EventZap`: `{ event, amount, comment?, relays }` - for zapping events
- [x] **FIX**: Use `EventZap` type (only `event`, no `profile` or `pubkey`):
  ```typescript
  nip57.makeZapRequest({
    event: actualTarget as NostrToolsEvent,
    amount: zapAmount,
    relays: config.relayMetadata.relays.map(r => r.url),
    comment
  });
  ```
- [x] nip57 internally extracts pubkey from event and creates appropriate tags

### GLOBAL Dark Hover/Highlight Fix
- [x] **ROOT CAUSE**: BlogSettingsProvider line 42 was:
  - `root.style.setProperty('--accent', hexToHsl(colors.primary));`
  - This set accent (hover color) to PRIMARY (dark gray #2D2D2D)
- [x] **FIX**: Removed that line, now accent uses muted (light gray)
- [x] Fixes dropdown menu hovers (was BLACK, now light gray)
- [x] Fixes profile button hover/active state
- [x] Fixes sidebar menu selections
- [x] Fixes all components using `bg-accent` for hover

### About Page Settings Not Saving
- [x] PublicLayout was using `user?.pubkey` for BlogSettingsProvider
- [x] Non-logged-in visitors saw default settings (broken)
- [x] Logged-in visitors saw THEIR settings, not owner's (broken)
- [x] Fixed: Changed to `BLOG_OWNER_PUBKEY ?? undefined`
- [x] All visitors now see the blog owner's customizations

### About Page Hero Section
- [x] Removed dark gray overlay design completely
- [x] New layout: Image on left (50%), Text on right (50%)
- [x] Clean card-style design with shadow and border
- [x] Uses gradient placeholder when no image is set
- [x] Proper responsive stacking on mobile

### Blog Settings Merge Function
- [x] Added missing `about` section handling to mergeBlogSettings()
- [x] About sections are now properly saved to Nostr (kind:30078)
- [x] About sections are now properly loaded from Nostr

### Admin Sidebar Colors
- [x] Changed active state from `bg-accent` to `bg-primary text-primary-foreground`
- [x] Changed hover state from `hover:bg-accent` to `hover:bg-muted`
- [x] Applied to both desktop and mobile sidebars

---

## Phase 6.12: UI Polish ✅ COMPLETE

### Footer
- [x] Removed "© 2026 V4V Blog. All rights reserved." text
- [x] Centered the "Vibed with Shakespeare" link

### Sidebar Hover Fix
- [x] Changed hover from `hover:bg-gray-100` to `hover:bg-muted`
- [x] `bg-muted` respects theme (light gray in both light/dark mode)
- [x] Applied to both desktop and mobile navigation

### Article Line Spacing (GLOBAL)
- [x] Set line-height to 1.6 (matching Notion/Primal styling)
- [x] Added global prose styles in `src/index.css`
- [x] Applies to all `.prose` elements (ArticleView, Editor, Preview)
- [x] Tighter paragraph margins (1rem instead of prose default)

### Header Scroll Behavior
- [x] Added scroll detection with useState/useEffect
- [x] Header becomes solid (`bg-background`) when scrolled > 10px
- [x] Transparent with blur when at top of page
- [x] Smooth transition between states

### GLOBAL Hover/Select Color Fix (COMPREHENSIVE)
**Problem**: Multiple components had dark gray hover/select states
**Root Cause**: Using `bg-primary` (dark), `bg-accent`, or `hover:bg-gray-100`

**Files Fixed**:
- [x] `AdminLayout.tsx`: Sidebar active `bg-primary` → `bg-muted`, hover → `hover:bg-muted/50`
- [x] `ThemeSettings.tsx`: All upload buttons `hover:bg-accent`/`hover:bg-gray-100` → `hover:bg-muted/50`
- [x] `AdminEditor.tsx`: Upload button `hover:bg-accent` → `hover:bg-muted/50`
- [x] `AccountSwitcher.tsx`: Trigger button `hover:bg-accent` → `hover:bg-muted/50`
- [x] `DMConversationList.tsx`: Conversation items `hover:bg-accent` → `hover:bg-muted/50`

**Rule**: NEVER use `bg-primary`, `bg-accent`, or `bg-gray-100` for hover/select states.
Always use `bg-muted` for selected and `hover:bg-muted/50` for hover.

### WHITE Background Fix for Cards/Tabs/Inputs (GLOBAL)
**Problem**: Tab containers, toolbars, and category badges had gray backgrounds
**Root Cause**: Using `bg-muted` which was too dark (98% → 96%)

**CSS Variables Updated** (index.css):
- `--muted`: 96% lightness (for skeletons/placeholders only)
- `--accent`: 97% lightness (subtle hover)

**Files Fixed - Replace bg-muted with border bg-background**:
- [x] `tabs.tsx` (UI component): Changed TabsList default
- [x] `AdminEditor.tsx`: Tab container
- [x] `ThemeSettings.tsx`: Tab container
- [x] `LoginDialog.tsx`: Tab container
- [x] `DMConversationList.tsx`: Tab buttons container
- [x] `EditorToolbar.tsx`: Toolbar background
- [x] `CategoryNav.tsx`: Category/tag badges

**Rule**: For interactive containers (tabs, toolbars, tag badges):
- ✅ Use `border bg-background` (white with subtle border)
- ❌ Never use `bg-muted` (causes gray appearance)

**For skeletons/placeholders**: `bg-muted` is OK (needs to show loading state)

### Linting & CI Fixes
- [x] `AboutPageBuilder.tsx`: Removed unused imports (Plus, CardTitle, CardDescription, Select, SelectContent, useBlogSettings, SelectItem, SelectTrigger, SelectValue)
- [x] `ZapButton.tsx`: Prefixed unused `variant` with underscore (`_variant`)
- [x] `index.html`: Added title, description, og:type, og:title, og:description meta tags
- [x] `manifest.webmanifest`: Created PWA manifest file in public/
- [x] `SearchPage.tsx`: Added eslint-disable comment for useEffect dependency
- [x] `EngagementBar.tsx`: Prefixed unused `showLikeCount` with underscore
- [x] `CommentSection.tsx`: Prefixed unused `error` with underscore (2 places)
- [x] `BookmarkButton.tsx`: Removed unused `useState` import, prefixed `error` with underscore
- [x] `EditorToolbar.tsx`: Prefixed unused `error` with underscore

---

## ERROR LOG & RULES (DO NOT REPEAT THESE MISTAKES)

### TypeScript/ESLint Rules - ALWAYS FOLLOW

**1. Unused Variables**
- ❌ NEVER leave unused variables: `const foo = bar` where `foo` is not used
- ✅ Prefix with underscore: `const _foo = bar` OR remove entirely
- ✅ For function params: `(_error)` not `(error)` if not used
- ✅ For destructured props: `_showLikeCount = true` not `showLikeCount = true`

**2. Unused Imports**
- ❌ NEVER import something and not use it
- ✅ Remove unused imports immediately after refactoring
- ✅ Check imports after every edit that removes code

**3. nostr-tools nip57.makeZapRequest API**
- ❌ WRONG: `{ profile: pubkey, event: event }` - 'profile' does not exist
- ✅ For EventZap: `{ event: NostrToolsEvent, amount, relays, comment }`
- ✅ For ProfileZap: `{ pubkey: string, amount, relays, comment }`
- ✅ NEVER mix both - use one OR the other

**4. CSS/Styling Rules**
- ❌ NEVER use `bg-primary` for hover/select states (it's dark)
- ❌ NEVER use `bg-accent` for hover states
- ❌ NEVER use `bg-gray-100` or `hover:bg-gray-100`
- ❌ NEVER use `bg-muted` for interactive containers (tabs, toolbars)
- ✅ Use `hover:bg-muted/50` for hover states
- ✅ Use `bg-muted` ONLY for selected state or skeletons
- ✅ Use `border bg-background` for tab containers, toolbars, badges

**5. index.html Requirements**
- ✅ MUST have `<title>` tag
- ✅ MUST have `<meta name="description">`
- ✅ MUST have `<meta property="og:type">`
- ✅ MUST have `<meta property="og:title">`
- ✅ MUST have `<meta property="og:description">`

**6. useEffect Dependencies**
- If intentionally omitting a dependency, add: `// eslint-disable-next-line react-hooks/exhaustive-deps`

### Errors Fixed Log

| Date | File | Error | Fix |
|------|------|-------|-----|
| 2026-02-23 | useZaps.ts | `profile` does not exist in type | Use EventZap type: only `event`, not `profile` |
| 2026-02-23 | useZaps.ts | Type 'string' not assignable to 'NostrEvent' | Pass full event object, not `actualTarget.id` |
| 2026-02-23 | AboutPageBuilder.tsx | Unused imports | Removed: Plus, CardTitle, CardDescription, Select, SelectContent, useBlogSettings, SelectItem, SelectTrigger, SelectValue |
| 2026-02-23 | ZapButton.tsx | 'variant' declared but never used | Changed to `_variant` |
| 2026-02-23 | EngagementBar.tsx | 'showLikeCount' declared but never used | Changed to `_showLikeCount` |
| 2026-02-23 | CommentSection.tsx | 'error' declared but never used (x2) | Changed to `_error` |
| 2026-02-23 | BookmarkButton.tsx | 'useState' imported but never used | Removed import |
| 2026-02-23 | BookmarkButton.tsx | 'error' declared but never used | Changed to `_error` |
| 2026-02-23 | EditorToolbar.tsx | 'error' declared but never used | Changed to `_error` |
| 2026-02-23 | SearchPage.tsx | React Hook useEffect missing dependency | Added eslint-disable comment |
| 2026-02-23 | index.html | Missing title and meta tags | Added title, description, og:* tags |
| 2026-02-23 | AdminLayout.tsx | Dark hover states | Changed `bg-primary` → `bg-muted`, `hover:bg-muted` → `hover:bg-muted/50` |
| 2026-02-23 | ThemeSettings.tsx | Dark hover states | Changed all `hover:bg-accent` and `hover:bg-gray-100` → `hover:bg-muted/50` |
| 2026-02-23 | Multiple files | Gray tab backgrounds | Changed `bg-muted` → `border bg-background` for all TabsList |

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
- Featured articles marked with `["featured", "true"]` tag
- **IMPORTANT**: `--accent` CSS variable must be LIGHT (for hovers), never dark
