import { MessageTimeline } from './MessageTimeline';
import { MessageComposer } from './MessageComposer';
import { useGetConversationParticipants } from '../../hooks/useQueries';
import { Button } from '../ui/button';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';

interface ConversationDetailProps {
  conversationId: string;
  onBack: () => void;
}

export function ConversationDetail({ conversationId, onBack }: ConversationDetailProps) {
  const { data: participants, isLoading } = useGetConversationParticipants(conversationId);

  const otherParticipant = participants?.[0];
  const displayName = otherParticipant?.fullName || 'Unknown User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-background">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        {isLoading ? (
          <>
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </>
        ) : (
          <>
            <Avatar className="h-10 w-10">
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
              <h3 className="font-semibold text-sm truncate">{displayName}</h3>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </>
        )}

        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <MessageTimeline conversationId={conversationId} />

      {/* Composer */}
      <MessageComposer conversationId={conversationId} />
    </div>
  );
}
