# V4V Blog Builder — Nostr Protocol Usage

This document describes how the V4V Blog Builder uses Nostr events.

---

## Events Used

### Standard NIPs (No Modifications)

| Kind | NIP | Purpose | Notes |
|------|-----|---------|-------|
| 0 | NIP-01 | User Metadata | Author profile display |
| 7 | NIP-25 | Reactions | Article likes |
| 6 | NIP-18 | Reposts | Article reposts |
| 16 | NIP-18 | Generic Repost | Article reposts |
| 1111 | NIP-22 | Comments | Article comments |
| 9734 | NIP-57 | Zap Request | Lightning payments |
| 9735 | NIP-57 | Zap Receipt | Payment confirmation |
| 10002 | NIP-65 | Relay List | User's relay preferences |
| 10003 | NIP-51 | Bookmark List | Saved articles |
| 10013 | NIP-37 | Private Relay List | For draft storage |
| 30023 | NIP-23 | Long-form Content | Published articles |
| 30024 | NIP-23 | Draft Long-form | Public drafts |
| 31234 | NIP-37 | Draft Wraps | Encrypted private drafts |

---

## Article Schema (kind:30023)

Published articles follow NIP-23 exactly, with these conventions:

### Required Tags
- `d` - URL slug (lowercase, hyphenated)
- `title` - Article title

### Recommended Tags
- `summary` - Article excerpt/description (for SEO)
- `image` - Featured image URL (16:9 aspect ratio recommended)
- `published_at` - Unix timestamp of first publication
- `t` - Topic/hashtag (multiple allowed)

### Optional Tags
- `category` - Single category name (for blog organization)
- `alt` - Human-readable description (NIP-31)

### Example

```json
{
  "kind": 30023,
  "pubkey": "...",
  "created_at": 1708700000,
  "content": "# My Article\n\nThis is the article content in **Markdown** format.\n\n## Section\n\nMore content here...",
  "tags": [
    ["d", "my-first-bitcoin-article"],
    ["title", "My First Bitcoin Article"],
    ["summary", "An introduction to Bitcoin and why it matters for content creators."],
    ["image", "https://blossom.primal.net/abc123.jpg"],
    ["published_at", "1708700000"],
    ["t", "bitcoin"],
    ["t", "v4v"],
    ["t", "lightning"],
    ["category", "Bitcoin"],
    ["alt", "Blog post: My First Bitcoin Article - An introduction to Bitcoin and why it matters for content creators."]
  ],
  "id": "...",
  "sig": "..."
}
```

---

## Blog Settings Schema (kind:30078)

Uses NIP-78 application-specific data to store blog configuration.

### Identifier
- `d` tag: `v4v-blog-settings`

### Content Structure (JSON)

```json
{
  "version": "1.0",
  
  "identity": {
    "blogName": "My Awesome Blog",
    "tagline": "Thoughts on Bitcoin and Freedom",
    "logo": {
      "type": "text",
      "text": "My Blog",
      "imageUrl": null
    }
  },
  
  "theme": {
    "preset": "magazine",
    "colors": {
      "primary": "#8B5CF6",
      "background": "#FFFFFF",
      "foreground": "#18181B",
      "muted": "#71717A",
      "border": "#E4E4E7",
      "card": "#FAFAFA"
    },
    "darkMode": {
      "enabled": true,
      "colors": {
        "background": "#09090B",
        "foreground": "#FAFAFA",
        "muted": "#A1A1AA",
        "border": "#27272A",
        "card": "#18181B"
      }
    },
    "fonts": {
      "heading": "Marcellus",
      "body": "Inter"
    },
    "borderRadius": "full"
  },
  
  "hero": {
    "enabled": true,
    "style": "fullWidth",
    "title": "Welcome to My Blog",
    "subtitle": "Subscribe for updates on Bitcoin, freedom, and more.",
    "backgroundImage": "https://blossom.primal.net/hero.jpg",
    "showSubscribe": true
  },
  
  "newsletter": {
    "provider": "convertkit",
    "config": {
      "apiKey": "ck_abc123...",
      "formId": "1234567"
    }
  },
  
  "categories": [
    "Bitcoin",
    "Podcast",
    "Lifestyle",
    "Music"
  ],
  
  "navigation": [
    { "label": "Articles", "href": "/" },
    { "label": "About", "href": "/about" },
    { "label": "Podcast", "href": "/category/podcast" }
  ],
  
  "social": {
    "twitter": "djvalerieblove",
    "nostr": "npub1...",
    "website": "https://djvalerieblove.com"
  }
}
```

### Example Event

```json
{
  "kind": 30078,
  "pubkey": "...",
  "created_at": 1708700000,
  "content": "{\"version\":\"1.0\",\"identity\":{\"blogName\":\"My Blog\"}, ...}",
  "tags": [
    ["d", "v4v-blog-settings"],
    ["alt", "Blog settings for V4V Blog Builder"]
  ],
  "id": "...",
  "sig": "..."
}
```

---

## Private Drafts (kind:31234)

Uses NIP-37 for encrypted draft storage.

### Structure
- `d` tag: Unique draft identifier
- `k` tag: `30023` (indicates this is a draft of a long-form article)
- `content`: NIP-44 encrypted JSON of the draft article

### Draft JSON Structure (before encryption)

```json
{
  "title": "Draft Article Title",
  "slug": "draft-article-slug",
  "summary": "Draft summary...",
  "image": "https://...",
  "category": "Bitcoin",
  "tags": ["bitcoin", "draft"],
  "content": "# Draft Content\n\nArticle body...",
  "blocks": [
    { "type": "heading", "level": 1, "content": "Draft Content" },
    { "type": "paragraph", "content": "Article body..." }
  ],
  "lastEdited": 1708700000
}
```

---

## Querying Articles

### Fetch Published Articles by Author

```typescript
const articles = await nostr.query([{
  kinds: [30023],
  authors: [authorPubkey],
  limit: 20,
}]);
```

### Fetch Single Article

```typescript
const article = await nostr.query([{
  kinds: [30023],
  authors: [authorPubkey],
  '#d': [articleSlug],
  limit: 1,
}]);
```

### Fetch Articles by Tag

```typescript
const articles = await nostr.query([{
  kinds: [30023],
  authors: [authorPubkey],
  '#t': [tagName],
  limit: 20,
}]);
```

### Fetch Article Engagement

```typescript
// Single query for all engagement types
const engagement = await nostr.query([{
  kinds: [7, 6, 16, 1111, 9735],
  '#a': [`30023:${authorPubkey}:${articleSlug}`],
  limit: 200,
}]);

// Separate by type
const reactions = engagement.filter(e => e.kind === 7);
const reposts = engagement.filter(e => e.kind === 6 || e.kind === 16);
const comments = engagement.filter(e => e.kind === 1111);
const zaps = engagement.filter(e => e.kind === 9735);
```

---

## Future: Members-Only Content

For future implementation of encrypted subscriber-only articles:

### Approach 1: NIP-44 Encryption to Subscriber List

```json
{
  "kind": 30023,
  "content": "<NIP-44 encrypted content>",
  "tags": [
    ["d", "members-only-article"],
    ["title", "Members Only: Exclusive Content"],
    ["summary", "This content is for subscribers only."],
    ["encrypted", "true"],
    ["p", "subscriber-pubkey-1"],
    ["p", "subscriber-pubkey-2"]
  ]
}
```

### Approach 2: Access via Zap Amount

Require minimum lifetime zap to author to unlock:
- Track zap totals per pubkey
- Decrypt locally if threshold met
- No protocol changes needed

### Approach 3: NIP-58 Badge Gating

Require specific badge to access:
- Author awards badge to subscribers
- Client checks for badge before showing content
- Badge can be sold/awarded via various methods

---

## Relay Recommendations

### Public Content
- `wss://relay.damus.io`
- `wss://relay.primal.net`
- `wss://nos.lol`
- `wss://relay.nostr.band` (for search)

### Private Drafts
- User's own relay (e.g., Railway deployment)
- Any NIP-42 AUTH-supporting relay
- Listed in user's kind:10013 event

---

## Compatibility Notes

- All articles are standard NIP-23 and work in any client (Habla, Yakihonne, etc.)
- Settings are app-specific but follow NIP-78 conventions
- Zaps work with any NIP-57 compatible wallet
- Comments use NIP-22 and appear in compatible clients
