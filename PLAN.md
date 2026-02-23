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

## Future Enhancements

- Multi-author support
- Secret/members-only posts
- Paid content (zap to unlock)
- Scheduled publishing
- Analytics integration
- RSS feed generation
- Import from Ghost/Substack/WordPress
- Custom domain support
