# V4V Blog Builder — Technical Specification

## Project Identity

**Name**: V4V Blog Builder
**Tagline**: Ghost-inspired blogging, powered by Nostr and Lightning
**License**: MIT (Open Source)
**Repository**: https://github.com/DJValerieBLOVE/v4v-blog-builder.git

---

## Design Specifications

### Visual Style
- **Aesthetic**: Elegant, modern, luxury
- **Buttons**: Large, fully rounded (pill style)
- **Images**: All thumbnails 16:9 aspect ratio
- **Spacing**: Generous whitespace, breathable layouts

### Typography
- **Heading Font**: Marcellus (NO bold weights)
- **Body Font**: Inter (or user-selected)
- **Heading Sizes**: Large, impactful (40px+ for h1)
- **Body Size**: 18px minimum for readability

### Color System
Theme-customizable via settings. Default neutral palette:
```css
--color-primary: #8B5CF6;      /* Accent color */
--color-background: #FFFFFF;   /* Page background */
--color-foreground: #18181B;   /* Text color */
--color-muted: #71717A;        /* Secondary text */
--color-border: #E4E4E7;       /* Borders */
--color-card: #FAFAFA;         /* Card backgrounds */
```

### Dark Mode
Optional toggle. When enabled:
```css
--color-background: #09090B;
--color-foreground: #FAFAFA;
--color-muted: #A1A1AA;
--color-border: #27272A;
--color-card: #18181B;
```

---

## Layout Specifications

### Magazine Layout (Default)
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]          [Articles] [About]        [Search] [Login] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              HERO SECTION                            │   │
│  │         (optional, configurable)                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐     │
│  │   [16:9 img]  │ │   [16:9 img]  │ │   [16:9 img]  │     │
│  │   Title       │ │   Title       │ │   Title       │     │
│  │   Summary...  │ │   Summary...  │ │   Summary...  │     │
│  │   Date • Tag  │ │   Date • Tag  │ │   Date • Tag  │     │
│  └───────────────┘ └───────────────┘ └───────────────┘     │
│                                                             │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐     │
│  │   ...more     │ │   ...more     │ │   ...more     │     │
│  └───────────────┘ └───────────────┘ └───────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Newsletter Layout
```
┌─────────────────────────────────────────────────────────────┐
│                        [Logo]                               │
│                     [Navigation]                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    HERO / SUBSCRIBE                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    ┌─────────────────────────────────────────────────┐     │
│    │  [Thumbnail]  Title                              │     │
│    │               Summary text here...               │     │
│    │               Feb 23, 2026 • Bitcoin             │     │
│    └─────────────────────────────────────────────────┘     │
│                                                             │
│    ┌─────────────────────────────────────────────────┐     │
│    │  [Thumbnail]  Title                              │     │
│    │               Summary text here...               │     │
│    └─────────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Minimal Layout
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    Blog Name                                                │
│    Short bio or tagline                                     │
│                                                             │
│    ─────────────────────────────────────────────────────    │
│                                                             │
│    • Article Title One                                      │
│      February 23, 2026                                      │
│                                                             │
│    • Article Title Two                                      │
│      February 20, 2026                                      │
│                                                             │
│    • Article Title Three                                    │
│      February 18, 2026                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### ArticleCard
```typescript
interface ArticleCardProps {
  article: NostrEvent;        // kind:30023 event
  layout: 'grid' | 'list' | 'minimal';
  showThumbnail?: boolean;    // default: true for grid/list
  showSummary?: boolean;      // default: true for grid/list
  showMeta?: boolean;         // default: true
}
```

Thumbnail must be 16:9 aspect ratio. Use `AspectRatio` component.

### EngagementBar
```typescript
interface EngagementBarProps {
  event: NostrEvent;          // The article being engaged with
  showZapAmount?: boolean;    // Show total sats
  showCommentCount?: boolean;
  showLikeCount?: boolean;
  showRepostCount?: boolean;
  layout: 'horizontal' | 'vertical';
}
```

### HeroSection
```typescript
interface HeroSectionProps {
  style: 'fullWidth' | 'split' | 'minimal' | 'none';
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  showSubscribe: boolean;
  subscribePosition: 'inline' | 'below';
}
```

### BlockEditor
Uses TipTap. Supported block types:
- `paragraph` - Basic text
- `heading` - h1, h2, h3 (Marcellus font)
- `bulletList` - Unordered list
- `orderedList` - Numbered list
- `blockquote` - Quote block
- `horizontalRule` - Divider
- `image` - With Blossom upload
- `video` - YouTube, Vimeo, Rumble embed
- `podcast` - Fountain, Spotify, Apple embed
- `linkCard` - URL preview card

---

## Embed Detection

Auto-detect and render embeds for these platforms:

### Video
| Platform | Pattern | Embed Type |
|----------|---------|------------|
| YouTube | `youtube.com`, `youtu.be` | iframe |
| Vimeo | `vimeo.com` | iframe |
| Rumble | `rumble.com` | iframe |
| Odysee | `odysee.com` | iframe |

### Podcast
| Platform | Pattern | Embed Type |
|----------|---------|------------|
| Fountain | `fountain.fm` | iframe |
| Spotify | `open.spotify.com` | iframe |
| Apple | `podcasts.apple.com` | iframe |
| YouTube Music | `music.youtube.com` | iframe |

### Social
| Platform | Pattern | Embed Type |
|----------|---------|------------|
| Twitter/X | `twitter.com`, `x.com` | Card |
| Nostr | `nostr:` URI | NoteContent |

### Fallback
Any unrecognized URL renders as a link card with:
- Favicon
- Page title (fetched if possible)
- URL display

---

## Newsletter Provider Integration

### Configuration Schema
```typescript
interface NewsletterConfig {
  provider: 'mailchimp' | 'convertkit' | 'buttondown' | 'beehiiv' | 'webhook' | 'none';
  
  // Mailchimp
  mailchimp?: {
    apiKey: string;
    listId: string;
    server: string;  // e.g., "us1"
  };
  
  // ConvertKit
  convertkit?: {
    apiKey: string;
    formId: string;
  };
  
  // Buttondown
  buttondown?: {
    apiKey: string;
  };
  
  // Beehiiv
  beehiiv?: {
    publicationId: string;
    apiKey: string;
  };
  
  // Generic Webhook
  webhook?: {
    url: string;
    method: 'POST' | 'GET';
    emailField: string;  // Field name for email in payload
  };
}
```

### Submit Flow
1. User enters email
2. Client validates email format
3. Client calls provider API (via CORS proxy if needed)
4. Show success/error message
5. Optionally offer Nostr follow as alternative

---

## Blog Settings Schema

Stored as `kind:30078` with `d` tag `v4v-blog-settings`:

```typescript
interface BlogSettings {
  // Identity
  blogName: string;
  tagline?: string;
  logo: {
    type: 'text' | 'image';
    text?: string;
    imageUrl?: string;
  };
  
  // Theme
  theme: 'magazine' | 'newsletter' | 'minimal';
  colors: {
    primary: string;
    background: string;
    foreground: string;
    // ... full palette
  };
  fonts: {
    heading: string;  // e.g., "Marcellus"
    body: string;     // e.g., "Inter"
  };
  darkMode: boolean;
  
  // Hero
  hero: {
    enabled: boolean;
    style: 'fullWidth' | 'split' | 'minimal';
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
    showSubscribe: boolean;
  };
  
  // Newsletter
  newsletter: NewsletterConfig;
  
  // Categories (user-defined)
  categories: string[];
  
  // Relays
  publishRelays: string[];
  privateRelays?: string[];  // For drafts (kind:10013)
}
```

---

## SEO & LLM Optimization

### Per-Article Meta Tags
```html
<title>{article.title} | {blogName}</title>
<meta name="description" content="{article.summary}">
<meta name="author" content="{author.name}">
<meta name="keywords" content="{article.tags.join(', ')}">

<meta property="og:type" content="article">
<meta property="og:title" content="{article.title}">
<meta property="og:description" content="{article.summary}">
<meta property="og:image" content="{article.image}">
<meta property="og:url" content="{canonicalUrl}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{article.title}">
<meta name="twitter:description" content="{article.summary}">
<meta name="twitter:image" content="{article.image}">
```

### JSON-LD Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{article.title}",
  "description": "{article.summary}",
  "image": "{article.image}",
  "author": {
    "@type": "Person",
    "name": "{author.name}",
    "url": "{author.website}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "{blogName}",
    "logo": "{logo.imageUrl}"
  },
  "datePublished": "{article.published_at}",
  "dateModified": "{article.created_at}"
}
```

---

## Zap Flow

### Logged-In User with Wallet
1. Click zap button
2. Select/enter amount
3. Optional: Add zap comment
4. Sign kind:9734 with signer
5. Send to recipient's LNURL callback
6. Receive invoice
7. Pay via NWC or WebLN
8. Zap receipt (kind:9735) published by recipient's server

### Logged-In User without Wallet
1. Click zap button
2. Select amount
3. Sign kind:9734
4. Receive invoice
5. Display QR code + copy button
6. User pays externally
7. Zap receipt published

### Anonymous User (Not Logged In)
1. Click zap button
2. Show login prompt OR continue anonymously
3. If anonymous: Fetch invoice directly (no kind:9734)
4. Display QR code
5. User pays externally
6. No zap receipt with sender identity

---

## File Structure

```
src/
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── layout/
│   │   ├── PublicLayout.tsx
│   │   ├── AdminLayout.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── blog/
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleGrid.tsx
│   │   ├── ArticleList.tsx
│   │   ├── ArticleFeed.tsx
│   │   ├── ArticleView.tsx
│   │   ├── ArticleMeta.tsx
│   │   ├── CategoryNav.tsx
│   │   ├── TagCloud.tsx
│   │   └── SearchBar.tsx
│   ├── hero/
│   │   ├── HeroSection.tsx
│   │   ├── SubscribeForm.tsx
│   │   └── HeroImage.tsx
│   ├── editor/
│   │   ├── BlockEditor.tsx
│   │   ├── blocks/
│   │   │   ├── ParagraphBlock.tsx
│   │   │   ├── HeadingBlock.tsx
│   │   │   ├── ImageBlock.tsx
│   │   │   ├── VideoBlock.tsx
│   │   │   ├── PodcastBlock.tsx
│   │   │   ├── QuoteBlock.tsx
│   │   │   ├── ListBlock.tsx
│   │   │   ├── LinkCardBlock.tsx
│   │   │   └── DividerBlock.tsx
│   │   ├── EditorToolbar.tsx
│   │   ├── ArticleSettings.tsx
│   │   └── PublishPanel.tsx
│   ├── engagement/
│   │   ├── ZapButton.tsx
│   │   ├── ZapDisplay.tsx
│   │   ├── LikeButton.tsx
│   │   ├── RepostButton.tsx
│   │   ├── ShareButton.tsx
│   │   ├── BookmarkButton.tsx
│   │   ├── CommentSection.tsx
│   │   └── EngagementBar.tsx
│   ├── admin/
│   │   ├── Dashboard.tsx
│   │   ├── ArticleManager.tsx
│   │   ├── DraftsList.tsx
│   │   └── StatsCards.tsx
│   ├── settings/
│   │   ├── ThemeSettings.tsx
│   │   ├── NewsletterSettings.tsx
│   │   ├── ProfileSettings.tsx
│   │   ├── RelaySettings.tsx
│   │   └── ThemePreview.tsx
│   └── theme/
│       ├── ThemeProvider.tsx
│       ├── themes/
│       │   ├── magazine.ts
│       │   ├── newsletter.ts
│       │   └── minimal.ts
│       └── ThemeSwitcher.tsx
├── hooks/
│   ├── useArticles.ts
│   ├── useArticle.ts
│   ├── useDrafts.ts
│   ├── usePublishArticle.ts
│   ├── useArticleZaps.ts
│   ├── useArticleComments.ts
│   ├── useArticleEngagement.ts
│   ├── useBookmarks.ts
│   ├── useCategories.ts
│   ├── useSearch.ts
│   ├── useBlogSettings.ts
│   └── useNewsletterSubmit.ts
├── pages/
│   ├── public/
│   │   ├── HomePage.tsx
│   │   ├── ArticlePage.tsx
│   │   ├── CategoryPage.tsx
│   │   ├── TagPage.tsx
│   │   ├── SearchPage.tsx
│   │   └── AboutPage.tsx
│   └── admin/
│       ├── AdminDashboard.tsx
│       ├── AdminArticles.tsx
│       ├── AdminEditor.tsx
│       ├── AdminSettings.tsx
│       └── AdminBookmarks.tsx
├── lib/
│   ├── blocks.ts
│   ├── markdown.ts
│   ├── embeds.ts
│   ├── seo.ts
│   ├── newsletter-providers/
│   │   ├── mailchimp.ts
│   │   ├── convertkit.ts
│   │   ├── buttondown.ts
│   │   ├── beehiiv.ts
│   │   └── webhook.ts
│   └── themes.ts
└── contexts/
    ├── ThemeContext.tsx
    └── EditorContext.tsx
```

---

## Dependencies to Add

```json
{
  "dependencies": {
    "@tiptap/react": "^2.x",
    "@tiptap/starter-kit": "^2.x",
    "@tiptap/extension-image": "^2.x",
    "@tiptap/extension-link": "^2.x",
    "@tiptap/extension-placeholder": "^2.x",
    "@tiptap/extension-youtube": "^2.x",
    "@fontsource/marcellus": "^5.x"
  }
}
```

---

## Accessibility Requirements

- All interactive elements keyboard accessible
- ARIA labels on icon-only buttons
- Focus visible states
- Color contrast minimum 4.5:1
- Screen reader friendly article structure
- Skip to content link
- Reduced motion support
