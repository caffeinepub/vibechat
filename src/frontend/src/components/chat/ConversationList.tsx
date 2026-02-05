import { useGetUserConversations, useGetConversationParticipants } from '../../hooks/useQueries';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface ConversationListProps {
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

function ConversationRow({ conversationId, isSelected, onClick }: { conversationId: string; isSelected: boolean; onClick: () => void }) {
  const { data: participants, isLoading } = useGetConversationParticipants(conversationId);

  if (isLoading) {
    return (
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </div>
    );
  }

  const otherParticipant = participants?.[0];
  const displayName = otherParticipant?.fullName || 'Unknown User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 border-b border-border hover:bg-accent transition-colors text-left ${
        isSelected ? 'bg-accent' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          {otherParticipant?.profilePicture ? (
            <AvatarImage
              src={otherParticipant.profilePicture.getDirectURL()}
              alt={displayName}
            />
          ) : (
            <AvatarFallback>{initials}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{displayName}</p>
          <p className="text-xs text-muted-foreground truncate">
            Tap to open conversation
          </p>
        </div>
      </div>
    </button>
  );
}

export function ConversationList({ selectedConversationId, onSelectConversation }: ConversationListProps) {
  const { data: conversations, isLoading, isError, error } = useGetUserConversations();

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load conversations'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-2">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">No conversations yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Start a new chat to begin messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversationId) => (
        <ConversationRow
          key={conversationId}
          conversationId={conversationId}
          isSelected={selectedConversationId === conversationId}
          onClick={() => onSelectConversation(conversationId)}
        />
      ))}
    </div>
  );
}
