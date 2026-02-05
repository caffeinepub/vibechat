import { BrandLogo } from './BrandLogo';
import { Button } from './ui/button';
import { MessageSquare } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <BrandLogo size="md" />
        </div>

        <nav className="flex items-center gap-6">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Features
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            About
          </Button>
          <Button size="sm" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Start Chatting</span>
            <span className="sm:hidden">Chat</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
