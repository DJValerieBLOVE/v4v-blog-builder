# V4V Blog Builder — Project Plan

> A Ghost-inspired, Nostr-native blog platform with Lightning zaps

## Overview

**Project**: V4V Blog Builder
**Purpose**: Open-source template for creating personal/professional blogs on Nostr with native Bitcoin monetization
**Target Users**: Content creators, podcasters, writers who want to own their content and accept Lightning payments

---

## Architecture

### Routes

```
PUBLIC ROUTES
├── /                      Homepage (hero + article feed)
├── /article/:npub/:slug   Single article view
├── /category/:slug        Articles by category
├── /tag/:tag              Articles by tag
├── /search                Search results
├── /about                 About page (from kind:0)
└── /:nip19                NIP-19 handler

ADMIN ROUTES (requires login)
├── /admin                 Dashboard (stats overview)
├── /admin/articles        Article list (published + drafts)
├── /admin/editor          New article
├── /admin/editor/:id      Edit article/draft
├── /admin/settings        Blog settings
└── /admin/bookmarks       Saved articles
```

### Nostr Events

| Purpose | Kind | NIP | Visibility |
|---------|------|-----|------------|
| Published Article | 30023 | NIP-23 | Public |
| Draft Article | 30024 | NIP-23 | Public draft |
| Private Draft | 31234 | NIP-37 | Encrypted |
| Comments | 1111 | NIP-22 | Public |
| Reactions | 7 | NIP-25 | Public |
| Reposts | 6/16 | NIP-18 | Public |
| Zap Request | 9734 | NIP-57 | Public |
| Zap Receipt | 9735 | NIP-57 | Public |
| Bookmarks | 10003 | NIP-51 | Public |
| Blog Settings | 30078 | NIP-78 | Public |
| Private Relays | 10013 | NIP-37 | Encrypted |

---

## Build Phases

### Phase 1: Foundation ✅
**Goal**: Basic blog reading experience

- [x] Project setup and routing
- [x] Public layout (header, footer)
- [x] Homepage with article feed
- [x] Single article view
- [x] Article card component (16:9 thumbnails)
- [x] Category and tag pages
- [x] Search functionality
- [x] SEO meta tags
- [x] `useArticles` hook
- [x] `useArticle` hook

**Deliverable**: Working blog reader

---

### Phase 2: Engagement ✅
**Goal**: V4V and social features

- [x] ZapButton for articles
- [x] Zap display (totals + recent)
- [x] Anonymous zap flow (QR invoice)
- [x] Like/reaction button
- [x] Repost button
- [x] Comment section (kind:1111)
- [x] Share button
- [x] Bookmark button
- [x] Engagement bar
- [x] `useArticleEngagement` hook
- [x] `useBookmarks` hook

**Deliverable**: Full V4V blog with engagement

---

### Phase 3: Admin & Editor ✅
**Goal**: Content creation

- [x] Admin layout with sidebar
- [x] Admin dashboard
- [x] Article manager
- [x] Block editor (TipTap)
- [x] Text blocks (paragraph, heading, list, quote)
- [x] Image block (Blossom upload)
- [x] Video embed block
- [x] Podcast embed block
- [x] Link card block
- [x] Article settings panel
- [x] Publish/draft controls
- [x] `usePublishArticle` hook
- [x] `useDrafts` hook

**Deliverable**: Full authoring experience

---

### Phase 4: Theme System ✅
**Goal**: Customizable appearance

- [x] Theme provider/context
- [x] Magazine theme preset
- [x] Newsletter theme preset
- [x] Minimal theme preset
- [x] Theme settings UI
- [x] Color customization
- [x] Font selection
- [x] Layout picker
- [x] Logo options
- [x] Hero settings
- [x] Dark mode toggle
- [x] Live preview
- [x] `useBlogSettings` hook

**Deliverable**: Customizable blog appearance

---

### Phase 5: Newsletter & Hero ✅
**Goal**: Subscriber growth

- [x] Hero section component
- [x] Subscribe form
- [x] Nostr follow button
- [x] Newsletter settings UI
- [x] Mailchimp integration
- [x] ConvertKit integration
- [x] Buttondown integration
- [x] Beehiiv integration
- [x] Generic webhook
- [x] `useNewsletterSubmit` hook

**Deliverable**: Working subscription system

---

### Phase 6: Polish & SEO ✅
**Goal**: Production-ready

- [x] JSON-LD structured data
- [x] Open Graph images
- [x] Sitemap generation
- [x] robots.txt
- [x] Performance optimization
- [x] Mobile responsiveness
- [x] Accessibility audit
- [x] Error states
- [x] Loading skeletons
- [x] Empty states
- [x] 404 page polish

**Deliverable**: LLM-readable, SEO-optimized

---

### Phase 6.5: UX Improvements ✅
**Goal**: Enhanced user experience

- [x] "New Article" button in header (logged-in users)
- [x] Fixed footer background color
- [x] Fixed dropdown menu accent colors
- [x] Strip markdown artifacts (** bold markers)
- [x] White background for article cards
- [x] Show category + 1 tag on cards (instead of read time)
- [x] Spread out action icons under posts
- [x] Zap button at top of article (author area)
- [x] Toggle comments (hidden by default)

**Deliverable**: Cleaner, more intuitive UI

---

### Phase 6.6: Owner/Visitor Separation ✅
**Goal**: Proper access control for deployed blogs

- [x] Blog owner configuration (`src/lib/blogOwner.ts`)
- [x] `useBlogOwner` hook for checking owner status
- [x] Admin area restricted to blog owner only
- [x] "Access Denied" page for non-owners
- [x] Owner-only controls (Dashboard, New Article) hidden from visitors
- [x] Builder mode warning when no owner configured
- [x] Visitors can still login to comment, zap, bookmark

**Architecture:**
```
BLOG OWNER (you)          VISITORS (readers who login)
├── Full admin access      ├── Read articles
├── Create/edit articles   ├── Comment on posts
├── Theme customization    ├── Zap articles
├── Newsletter settings    ├── Bookmark articles
└── Blog settings          └── Follow author
```

**Deliverable**: Proper owner vs visitor separation

---

### Phase 6.7: Theme & Editor UX ✅
**Goal**: Better design preview and editing experience

- [x] Smaller color preset bubbles (w-6 h-6)
- [x] Bubble-style tabs in Theme Settings (not full width)
- [x] 2-column layout for theme settings
- [x] Featured post in magazine layout (Ghost-style hero card)
- [x] Live site preview panel in Theme Settings

**Deliverable**: Designer-friendly theme customization

---

### Phase 6.8: Article Editor & About Page ✅
**Goal**: Improved editor workflow and customizable About page

- [x] Article settings inline with tabs (not slide-out sheet)
- [x] Content, Settings, Image tabs in editor

**Deliverable**: User-friendly article creation

---

### Phase 6.9: About Page Builder ✅
**Goal**: Visual drag-and-drop About page builder

- [x] Drag-and-drop section reordering
- [x] Section types: Hero, Writer, Text, Mission, Contact, Social
- [x] Live preview panel showing real-time changes
- [x] Enable/disable individual sections
- [x] Custom content for each section (title, text, images)
- [x] Fallback to Nostr profile data when fields empty
- [x] Fixed settings tabs visibility (white background with proper styling)

**Deliverable**: Visual About page builder with live preview

---

### Phase 6.10: Featured Articles & UI Polish ✅
**Goal**: Featured article system and settings layout improvements

- [x] 50/50 split layout for Theme Settings (controls/preview)
- [x] Featured article section in Magazine layout preview
- [x] Featured article section in Newsletter layout preview
- [x] Featured article section in Minimal layout preview
- [x] "Add to Featured" toggle in article editor
- [x] Featured flag stored in article tags
- [x] Featured status loaded when editing existing articles

**Deliverable**: Complete featured article system with improved settings UX

---

### Phase 6.11: Critical Bug Fixes ✅
**Goal**: Fix recurring TypeScript errors and UI color issues

- [x] **useZaps.ts TypeScript Error (PERMANENTLY FIXED)**
  - ROOT CAUSE: Passing string ID instead of Event object to `nip57.makeZapRequest`
  - FIX: Always pass full event object with cast `as NostrToolsEvent`
  - Removed conditional logic - nip57 handles `e`/`a` tags internally

- [x] **GLOBAL Dark Hover/Highlight Fix**
  - Root cause: BlogSettingsProvider was setting `--accent` to primary color (dark)
  - All dropdowns, sidebars, and buttons had BLACK hover states
  - Fixed by using `muted` color for accent instead of primary
  - Affects: dropdown menus, profile button, sidebar selections

- [x] **About Page Settings Not Saving**
  - PublicLayout was using `user?.pubkey` instead of `BLOG_OWNER_PUBKEY`
  - Non-logged-in visitors saw default settings
  - Logged-in visitors saw THEIR settings, not the blog owner's
  - Fixed: Always use BLOG_OWNER_PUBKEY for public pages

- [x] **About Page Hero Section Redesign**
  - Removed dark gray overlay design
  - New layout: Image on left (50%), Text on right (50%)
  - Clean card-style with proper shadow and border
  - Gradient placeholder when no image is set

- [x] **Blog Settings Merge Function**
  - Added missing `about` section handling
  - About sections now properly saved and loaded from Nostr

- [x] **Admin Sidebar Hover Colors**
  - Changed from `bg-accent` to `bg-muted` for hover states
  - Active state uses `bg-primary` for visibility

**Deliverable**: Stable, production-ready UI with no recurring build errors

---

### Phase 6.12: UI Polish ✅
**Goal**: Minor UI refinements

- [x] Remove copyright text from footer ("© 2026 All rights reserved")
- [x] Fix sidebar hover color (gray-100 → muted for theme compatibility)
- [x] Set article content line spacing to 1.6 (matching Notion/Primal)
- [x] Solid header background when user scrolls (no transparency)

**Deliverable**: Cleaner footer and improved article readability

---

## Data Models

### Article (kind:30023)

```json
{
  "kind": 30023,
  "content": "# Markdown content...",
  "tags": [
    ["d", "article-slug"],
    ["title", "Article Title"],
    ["summary", "Brief description"],
    ["image", "https://blossom.../thumbnail.jpg"],
    ["published_at", "1708700000"],
    ["t", "bitcoin"],
    ["t", "podcast"],
    ["category", "Bitcoin"],
    ["featured", "true"],
    ["alt", "Blog post: Article Title"]
  ]
}
```

### Blog Settings (kind:30078)

```json
{
  "kind": 30078,
  "tags": [["d", "v4v-blog-settings"]],
  "content": "{
    \"theme\": \"magazine\",
    \"layout\": { \"style\": \"magazine\", \"showHero\": true },
    \"colors\": { \"primary\": \"#8B5CF6\" },
    \"fonts\": { \"heading\": \"Marcellus\", \"body\": \"Inter\" },
    \"logo\": { \"type\": \"text\", \"text\": \"My Blog\" },
    \"newsletter\": { \"provider\": \"convertkit\", \"apiKey\": \"...\" },
    \"darkMode\": true
  }"
}
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Styling | TailwindCSS + shadcn/ui |
| Routing | React Router |
| State | TanStack Query |
| Nostr | Nostrify |
| Editor | TipTap |
| Files | Blossom (NIP-B7) |
| Build | Vite |

---

## Phase 7: RSS & Import (Upcoming)
**Goal**: SEO authority and content migration

- [ ] RSS feed generation (XML)
- [ ] RSS feed auto-discovery meta tag
- [ ] RSS import from external feeds
- [ ] Content migration from Ghost/Substack/WordPress

**Deliverable**: Proper blog SEO with feed support

---

## Phase 8: AI Writing Assistant (Future)
**Goal**: AI-powered content creation

- [ ] AI assistant panel in editor
- [ ] User brings own API key (stored locally)
- [ ] Generate/improve article content
- [ ] SEO title and summary suggestions
- [ ] Tag and category suggestions
- [ ] Readability improvements

**Deliverable**: AI-assisted blogging experience

---

## Future Enhancements

- Multi-author support
- Secret/members-only posts
- Paid content (zap to unlock)
- Scheduled publishing
- Analytics integration
- Custom domain support
