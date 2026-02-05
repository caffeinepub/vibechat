import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/BrandLogo';
import { PWAInstallCallout } from '@/components/PWAInstallCallout';

interface PreLoginIntroPageProps {
  onOpenAuth: () => void;
  onSkip: () => void;
}

export function PreLoginIntroPage({ onOpenAuth, onSkip }: PreLoginIntroPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Skip Button - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <Button variant="ghost" onClick={onSkip} className="text-muted-foreground hover:text-foreground">
          Skip
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-8">
              <BrandLogo className="h-24 w-24" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              WELCOME TO VIBECHAT WHERE YOU WILL NEVER GET BORED...
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              by Joshua Koech
            </p>
          </div>

          {/* PWA Install Callout */}
          <div className="max-w-2xl mx-auto">
            <PWAInstallCallout />
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-4 pt-4">
            <Button 
              size="lg" 
              className="text-lg px-12 h-14 shadow-lg hover:shadow-xl transition-all"
              onClick={onOpenAuth}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
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
  );
}
