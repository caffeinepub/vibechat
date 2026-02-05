import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppHeader } from './components/AppHeader';
import { LandingPage } from './pages/LandingPage';
import { SplashScreen } from './components/SplashScreen';
import { WhatsAppStyleAuth } from './components/WhatsAppStyleAuth';
import { Toaster } from './components/ui/sonner';

const queryClient = new QueryClient();

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      {showSplash && <SplashScreen onDismiss={() => setShowSplash(false)} />}
      <div className="min-h-screen flex flex-col bg-background">
        <AppHeader onOpenAuth={() => setAuthDialogOpen(true)} />
        <main className="flex-1">
          <LandingPage onOpenAuth={() => setAuthDialogOpen(true)} />
        </main>
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
      </div>
      <WhatsAppStyleAuth open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
