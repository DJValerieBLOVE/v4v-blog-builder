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

### Phase 1: Foundation
**Goal**: Basic blog reading experience

- [ ] Project setup and routing
- [ ] Public layout (header, footer)
- [ ] Homepage with article feed
- [ ] Single article view
- [ ] Article card component (16:9 thumbnails)
- [ ] Category and tag pages
- [ ] Search functionality
- [ ] SEO meta tags
- [ ] `useArticles` hook
- [ ] `useArticle` hook

**Deliverable**: Working blog reader

---

### Phase 2: Engagement
**Goal**: V4V and social features

- [ ] ZapButton for articles
- [ ] Zap display (totals + recent)
- [ ] Anonymous zap flow (QR invoice)
- [ ] Like/reaction button
- [ ] Repost button
- [ ] Comment section (kind:1111)
- [ ] Share button
- [ ] Bookmark button
- [ ] Engagement bar
- [ ] `useArticleEngagement` hook
- [ ] `useBookmarks` hook

**Deliverable**: Full V4V blog with engagement

---

### Phase 3: Admin & Editor
**Goal**: Content creation

- [ ] Admin layout with sidebar
- [ ] Admin dashboard
- [ ] Article manager
- [ ] Block editor (TipTap)
- [ ] Text blocks (paragraph, heading, list, quote)
- [ ] Image block (Blossom upload)
- [ ] Video embed block
- [ ] Podcast embed block
- [ ] Link card block
- [ ] Article settings panel
- [ ] Publish/draft controls
- [ ] `usePublishArticle` hook
- [ ] `useDrafts` hook

**Deliverable**: Full authoring experience

---

### Phase 4: Theme System
**Goal**: Customizable appearance

- [ ] Theme provider/context
- [ ] Magazine theme preset
- [ ] Newsletter theme preset
- [ ] Minimal theme preset
- [ ] Theme settings UI
- [ ] Color customization
- [ ] Font selection
- [ ] Layout picker
- [ ] Logo options
- [ ] Hero settings
- [ ] Dark mode toggle
- [ ] Live preview
- [ ] `useBlogSettings` hook

**Deliverable**: Customizable blog appearance

---

### Phase 5: Newsletter & Hero
**Goal**: Subscriber growth

- [ ] Hero section component
- [ ] Subscribe form
- [ ] Nostr follow button
- [ ] Newsletter settings UI
- [ ] Mailchimp integration
- [ ] ConvertKit integration
- [ ] Buttondown integration
- [ ] Beehiiv integration
- [ ] Generic webhook
- [ ] `useNewsletterSubmit` hook

**Deliverable**: Working subscription system

---

### Phase 6: Polish & SEO
**Goal**: Production-ready

- [ ] JSON-LD structured data
- [ ] Open Graph images
- [ ] Sitemap generation
- [ ] robots.txt
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Accessibility audit
- [ ] Error states
- [ ] Loading skeletons
- [ ] Empty states
- [ ] 404 page polish

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
