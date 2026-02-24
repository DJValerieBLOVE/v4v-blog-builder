import { useState } from 'react';
import { MessageCircle, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { NostrEvent } from '@nostrify/nostrify';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuthor } from '@/hooks/useAuthor';
import { useComments } from '@/hooks/useComments';
import { usePostComment } from '@/hooks/usePostComment';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

interface CommentSectionProps {
  article: NostrEvent;
  className?: string;
}

export function CommentSection({ article, className }: CommentSectionProps) {
  const { user } = useCurrentUser();
  const { toast } = useToast();
  const { data, isLoading } = useComments(article);
  const { mutateAsync: postComment, isPending: isPosting } = usePostComment();
  const [newComment, setNewComment] = useState('');
  const [showAll, setShowAll] = useState(false);

  const comments = data?.topLevelComments ?? [];
  const displayedComments = showAll ? comments : comments.slice(0, 3);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please log in to comment.',
        variant: 'destructive',
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: 'Empty comment',
        description: 'Please write something before posting.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await postComment({
        content: newComment.trim(),
        root: article,
      });
      setNewComment('');
      toast({
        title: 'Comment posted!',
        description: 'Your comment has been published.',
      });
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to post comment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="font-heading flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? 'Write a comment...' : 'Log in to comment'}
            disabled={!user || isPosting}
            className="min-h-[100px] resize-none"
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!user || isPosting || !newComment.trim()}
              className="rounded-full gap-2"
            >
              <Send className="h-4 w-4" />
              Post Comment
            </Button>
          </div>
        </form>

        {/* Comments List */}
        {isLoading ? (
          <CommentsSkeleton />
        ) : comments.length > 0 ? (
          <div className="space-y-6">
            {displayedComments.map((comment) => (
              <CommentItem 
                key={comment.id} 
                comment={comment}
                getDirectReplies={data?.getDirectReplies}
                article={article}
              />
            ))}
            
            {comments.length > 3 && (
              <Button
                variant="ghost"
                onClick={() => setShowAll(!showAll)}
                className="w-full gap-2"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Show all {comments.length} comments
                  </>
                )}
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface CommentItemProps {
  comment: NostrEvent;
  getDirectReplies?: (commentId: string) => NostrEvent[];
  article: NostrEvent;
  depth?: number;
}

function CommentItem({ comment, getDirectReplies, article, depth = 0 }: CommentItemProps) {
  const author = useAuthor(comment.pubkey);
  const metadata = author.data?.metadata;
  const [showReplies, setShowReplies] = useState(depth < 2);
  const [showReplyForm, setShowReplyForm] = useState(false);
  
  const replies = getDirectReplies?.(comment.id) ?? [];
  const timeAgo = formatDistanceToNow(new Date(comment.created_at * 1000), { addSuffix: true });

  return (
    <div className={cn('', depth > 0 && 'pl-8 border-l-2 border-muted')}>
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={metadata?.picture} />
          <AvatarFallback>
            {metadata?.name?.[0]?.toUpperCase() ?? '?'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm truncate">
              {metadata?.name ?? 'Anonymous'}
            </span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
          <p className="text-sm whitespace-pre-wrap break-words">{comment.content}</p>
          
          <div className="flex items-center gap-2 mt-2">
            {depth < 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                Reply
              </Button>
            )}
            {replies.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? 'Hide' : 'Show'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
              </Button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <ReplyForm
              article={article}
              parentComment={comment}
              onClose={() => setShowReplyForm(false)}
            />
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {showReplies && replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              getDirectReplies={getDirectReplies}
              article={article}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ReplyFormProps {
  article: NostrEvent;
  parentComment: NostrEvent;
  onClose: () => void;
}

function ReplyForm({ article, parentComment, onClose }: ReplyFormProps) {
  const { user } = useCurrentUser();
  const { toast } = useToast();
  const { mutateAsync: postComment, isPending } = usePostComment();
  const [reply, setReply] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reply.trim()) return;

    try {
      await postComment({
        content: reply.trim(),
        root: article,
        reply: parentComment,
      });
      setReply('');
      onClose();
      toast({
        title: 'Reply posted!',
      });
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to post reply.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2">
      <Textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Write a reply..."
        disabled={!user || isPending}
        className="min-h-[80px] resize-none text-sm"
        autoFocus
      />
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={!reply.trim() || isPending}
          className="rounded-full"
        >
          Reply
        </Button>
      </div>
    </form>
  );
}

function CommentsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
