/**
 * Blog Owner Configuration
 * 
 * This file defines who owns this blog instance.
 * When deployed, only the owner can:
 * - Access the admin dashboard
 * - Create/edit articles
 * - Change blog settings
 * 
 * Visitors who log in can:
 * - Comment on articles
 * - Zap articles
 * - Bookmark articles
 * - Follow the blog owner
 */

/**
 * The blog owner's Nostr public key (hex format)
 * 
 * To set up your blog:
 * 1. Log in with your Nostr account
 * 2. Your pubkey will be shown in the console
 * 3. Copy it here to claim ownership
 * 
 * Leave as null for "builder mode" where anyone logged in is treated as owner
 * (useful for development/testing)
 */
export const BLOG_OWNER_PUBKEY: string | null = '3d70ec1ea586650a0474d6858454209d222158f4079e8db806f017ef5e30e767';

/**
 * Check if a pubkey is the blog owner
 * 
 * If BLOG_OWNER_PUBKEY is null (builder mode), returns true for any logged-in user
 * If BLOG_OWNER_PUBKEY is set, only that specific user is the owner
 */
export function isBlogOwner(userPubkey: string | undefined): boolean {
  if (!userPubkey) return false;
  
  // Builder mode: anyone logged in is treated as owner
  if (BLOG_OWNER_PUBKEY === null) {
    return true;
  }
  
  // Production mode: only the configured owner
  return userPubkey === BLOG_OWNER_PUBKEY;
}

/**
 * Check if we're in builder mode (no owner configured)
 */
export function isBuilderMode(): boolean {
  return BLOG_OWNER_PUBKEY === null;
}
