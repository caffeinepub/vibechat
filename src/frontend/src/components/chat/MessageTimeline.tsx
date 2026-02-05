import { useGetMessages } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, Image as ImageIcon, Video as VideoIcon, Download } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { useEffect, useRef } from 'react';
import type { Message } from '../../backend';

interface MessageTimelineProps {
  conversationId: string;
}

function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[70%] ${isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-2xl px-4 py-2 space-y-2`}>
        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="space-y-2">
            {message.attachments.map((attachment, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden">
                {attachment.attachmentType === 'photo' ? (
                  <img
                    src={attachment.blob.getDirectURL()}
                    alt="Shared photo"
                    className="max-w-full h-auto rounded-lg"
                  />
                ) : (
                  <div className="relative">
                    <video
                      src={attachment.blob.getDirectURL()}
                      controls
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Text */}
        {message.text && (
          <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
        )}
        
        {/* Timestamp */}
        <p className={`text-xs ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'} text-right`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

export function MessageTimeline({ conversationId }: MessageTimelineProps) {
  const { data: messages, isLoading, isError, error } = useGetMessages(conversationId);
  const { identity } = useInternetIdentity();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
            <Skeleton className="h-16 w-64 rounded-2xl" />
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
            {error instanceof Error ? error.message : 'Failed to load messages'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">No messages yet</p>
          <p className="text-sm text-muted-foreground">Send a message to start the conversation</p>
        </div>
      </div>
    );
  }

  const currentUserPrincipal = identity?.getPrincipal().toString();

  return (
    <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-muted/10">
      {messages.map((message, idx) => {
        const isOwn = message.sender.toString() === currentUserPrincipal;
        return <MessageBubble key={idx} message={message} isOwn={isOwn} />;
      })}
    </div>
  );
}
