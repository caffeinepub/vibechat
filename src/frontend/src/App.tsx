import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppHeader } from './components/AppHeader';
import { LandingPage } from './pages/LandingPage';
import { ChatsPage } from './pages/ChatsPage';
import { GroupsPage } from './pages/GroupsPage';
import { StatusPage } from './pages/StatusPage';
import { LivePage } from './pages/LivePage';
import { VideosPage } from './pages/VideosPage';
import { SplashScreen } from './components/SplashScreen';
import { WhatsAppStyleAuth } from './components/WhatsAppStyleAuth';
import { ContactsSyncDialog } from './components/ContactsSyncDialog';
import { Toaster } from './components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';

const queryClient = new QueryClient();

type Section = 'chats' | 'groups' | 'status' | 'live' | 'videos';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [contactsDialogOpen, setContactsDialogOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<Section>('chats');

  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Auto-open profile setup if needed
  if (showProfileSetup && !authDialogOpen) {
    setAuthDialogOpen(true);
  }

  const handleNavigateToChats = () => {
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }
    setCurrentSection('chats');
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'chats':
        return <ChatsPage />;
      case 'groups':
        return <GroupsPage />;
      case 'status':
        return <StatusPage />;
      case 'live':
        return <LivePage />;
      case 'videos':
        return <VideosPage />;
      default:
        return <ChatsPage />;
    }
  };

  return (
    <>
      {showSplash && <SplashScreen onDismiss={() => setShowSplash(false)} />}
      <div className="min-h-screen flex flex-col bg-background">
        <AppHeader 
          onOpenAuth={() => setAuthDialogOpen(true)}
          onOpenContacts={() => setContactsDialogOpen(true)}
          currentSection={isAuthenticated ? currentSection : null}
          onSectionChange={setCurrentSection}
        />
        <main className="flex-1">
          {!isAuthenticated ? (
            <LandingPage 
              onOpenAuth={() => setAuthDialogOpen(true)}
              onOpenContacts={() => setContactsDialogOpen(true)}
              onNavigateToChats={handleNavigateToChats}
            />
          ) : (
            renderSection()
          )}
        </main>
        {!isAuthenticated && (
          <footer className="border-t border-border py-6 px-4">
            <div className="container mx-auto text-center text-sm text-muted-foreground">
              © 2026. Built with <span className="text-accent">♥</span> using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors underline"
              >
                caffeine.ai
              </a>
            </div>
          </footer>
        )}
      </div>
      <WhatsAppStyleAuth open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      <ContactsSyncDialog 
        open={contactsDialogOpen} 
        onOpenChange={setContactsDialogOpen}
        onStartChat={handleNavigateToChats}
      />
      <Toaster />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
