/**
 * Blog Settings Types and Defaults
 * Stored as kind:30078 with d-tag "v4v-blog-settings"
 */

export interface BlogSettings {
  version: string;
  
  identity: {
    blogName: string;
    tagline?: string;
    logo: {
      type: 'text' | 'image';
      text?: string;
      imageUrl?: string;
    };
  };
  
  theme: {
    preset: 'magazine' | 'newsletter' | 'minimal';
    colors: ThemeColors;
    darkMode: {
      enabled: boolean;
      colors?: Partial<ThemeColors>;
    };
    fonts: {
      heading: string;
      body: string;
    };
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  };
  
  hero: {
    enabled: boolean;
    style: 'fullWidth' | 'split' | 'minimal';
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
    showSubscribe: boolean;
  };
  
  newsletter?: {
    provider: 'none' | 'mailchimp' | 'convertkit' | 'buttondown' | 'beehiiv' | 'webhook';
    config?: Record<string, string>;
  };
  
  categories: string[];
  
  navigation: Array<{
    label: string;
    href: string;
  }>;
  
  social?: {
    twitter?: string;
    nostr?: string;
    website?: string;
  };
}

export interface ThemeColors {
  primary: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  card: string;
}

/**
 * Default blog settings
 */
export const defaultBlogSettings: BlogSettings = {
  version: '1.0',
  
  identity: {
    blogName: 'V4V Blog',
    tagline: 'Powered by Nostr & Lightning',
    logo: {
      type: 'text',
      text: 'V4V Blog',
    },
  },
  
  theme: {
    preset: 'magazine',
    colors: {
      primary: '#8B5CF6',
      background: '#FFFFFF',
      foreground: '#18181B',
      muted: '#71717A',
      border: '#E4E4E7',
      card: '#FAFAFA',
    },
    darkMode: {
      enabled: true,
      colors: {
        background: '#09090B',
        foreground: '#FAFAFA',
        muted: '#A1A1AA',
        border: '#27272A',
        card: '#18181B',
      },
    },
    fonts: {
      heading: 'Marcellus',
      body: 'Inter',
    },
    borderRadius: 'full',
  },
  
  hero: {
    enabled: true,
    style: 'fullWidth',
    title: 'Build Your Value for Value Blog',
    subtitle: 'Own your content. Get paid in Bitcoin.',
    showSubscribe: true,
  },
  
  categories: ['Bitcoin', 'Podcast', 'Lifestyle'],
  
  navigation: [
    { label: 'Articles', href: '/' },
    { label: 'About', href: '/about' },
  ],
};

/**
 * Theme presets
 */
export interface ThemePreset {
  name: string;
  description: string;
  settings: Partial<BlogSettings['theme']>;
  heroStyle: BlogSettings['hero']['style'];
}

export const themePresets: Record<string, ThemePreset> = {
  magazine: {
    name: 'Magazine',
    description: 'Classic blog layout with grid of article cards',
    settings: {
      preset: 'magazine',
      borderRadius: 'lg',
    },
    heroStyle: 'fullWidth',
  },
  newsletter: {
    name: 'Newsletter',
    description: 'Email-style layout with centered content',
    settings: {
      preset: 'newsletter',
      borderRadius: 'md',
    },
    heroStyle: 'split',
  },
  minimal: {
    name: 'Minimal',
    description: 'Clean, text-focused layout',
    settings: {
      preset: 'minimal',
      borderRadius: 'sm',
    },
    heroStyle: 'minimal',
  },
};

/**
 * Color presets
 */
export const colorPresets = {
  purple: {
    name: 'Purple',
    primary: '#8B5CF6',
  },
  blue: {
    name: 'Blue',
    primary: '#3B82F6',
  },
  green: {
    name: 'Green',
    primary: '#10B981',
  },
  orange: {
    name: 'Orange',
    primary: '#F97316',
  },
  pink: {
    name: 'Pink',
    primary: '#EC4899',
  },
  red: {
    name: 'Red',
    primary: '#EF4444',
  },
};

/**
 * Convert hex color to HSL CSS variable format
 */
export function hexToHsl(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  
  let h = 0;
  let s = 0;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
