import { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { LandingPage } from './pages/LandingPage';
import { SplashScreen } from './components/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onDismiss={() => setShowSplash(false)} />}
      <div className="min-h-screen flex flex-col bg-background">
        <AppHeader />
        <main className="flex-1">
          <LandingPage />
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
    </>
  );
}

export default App;
