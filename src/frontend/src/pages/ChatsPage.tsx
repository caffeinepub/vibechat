import { useState } from 'react';
import { ConversationList } from '../components/chat/ConversationList';
import { ConversationDetail } from '../components/chat/ConversationDetail';
import { NewConversationDialog } from '../components/chat/NewConversationDialog';
import { Button } from '../components/ui/button';
import { MessageSquarePlus, ArrowLeft } from 'lucide-react';

export function ChatsPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newConversationOpen, setNewConversationOpen] = useState(false);
  const [isMobileDetailView, setIsMobileDetailView] = useState(false);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsMobileDetailView(true);
  };

  const handleBackToList = () => {
    setIsMobileDetailView(false);
    setSelectedConversationId(null);
  };

  const handleNewConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsMobileDetailView(true);
    setNewConversationOpen(false);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-background">
      {/* Conversation List - Hidden on mobile when detail is shown */}
      <div className={`${isMobileDetailView ? 'hidden' : 'flex'} md:flex flex-col w-full md:w-96 border-r border-border bg-background`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold">Chats</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setNewConversationOpen(true)}
            className="rounded-full"
          >
            <MessageSquarePlus className="h-5 w-5" />
          </Button>
        </div>
        <ConversationList
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      {/* Conversation Detail - Hidden on mobile when no conversation selected */}
      <div className={`${!isMobileDetailView && !selectedConversationId ? 'hidden' : 'flex'} md:flex flex-1 flex-col`}>
        {selectedConversationId ? (
          <ConversationDetail
            conversationId={selectedConversationId}
            onBack={handleBackToList}
          />
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-muted/20">
            <div className="text-center space-y-4 p-8">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-2">
                <MessageSquarePlus className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold">Select a chat</h3>
              <p className="text-muted-foreground max-w-sm">
                Choose a conversation from the list or start a new chat
              </p>
              <Button onClick={() => setNewConversationOpen(true)} className="gap-2">
                <MessageSquarePlus className="h-4 w-4" />
                New Chat
              </Button>
            </div>
          </div>
        )}
      </div>

      <NewConversationDialog
        open={newConversationOpen}
        onOpenChange={setNewConversationOpen}
        onConversationCreated={handleNewConversation}
      />
    </div>
  );
}
