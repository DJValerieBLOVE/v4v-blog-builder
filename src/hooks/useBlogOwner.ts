import { useCurrentUser } from '@/hooks/useCurrentUser';
import { isBlogOwner, isBuilderMode, BLOG_OWNER_PUBKEY } from '@/lib/blogOwner';

/**
 * Hook to check if the current user is the blog owner
 * 
 * Returns:
 * - isOwner: true if current user can access admin features
 * - isBuilderMode: true if no owner is configured (development mode)
 * - ownerPubkey: the configured owner pubkey (or null if builder mode)
 */
export function useBlogOwner() {
  const { user } = useCurrentUser();
  
  return {
    isOwner: isBlogOwner(user?.pubkey),
    isBuilderMode: isBuilderMode(),
    ownerPubkey: BLOG_OWNER_PUBKEY,
    userPubkey: user?.pubkey,
  };
}
