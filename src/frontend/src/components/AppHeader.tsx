import { BrandLogo } from './BrandLogo';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { User, Loader2, Video, Radio, MoreVertical, Contact, MessageSquare } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { toast } from 'sonner';

interface AppHeaderProps {
  onOpenAuth: () => void;
  onOpenContacts: () => void;
  onNavigateToChats: () => void;
  currentView: 'landing' | 'chats';
  onViewChange: (view: 'landing' | 'chats') => void;
}

export function AppHeader({ onOpenAuth, onOpenContacts, onNavigateToChats, currentView, onViewChange }: AppHeaderProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAuthAction = async () => {
    if (!isAuthenticated) {
      try {
        await login();
      } catch (error) {
        console.error('Login error:', error);
      }
    } else {
      onOpenAuth();
    }
  };

  const handleLiveClick = () => {
    toast.info('Live is coming soon.');
  };

  const handleVideosClick = () => {
    toast.info('Videos is coming soon.');
  };

  const handleContactsClick = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to access contacts');
      return;
    }
    onOpenContacts();
  };

  const handleChatsClick = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to access chats');
      return;
    }
    onNavigateToChats();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
        {/* Left: Logo + Title */}
        <button 
          onClick={() => onViewChange('landing')}
          className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity"
        >
          <BrandLogo size="md" />
          <h1 className="text-xl font-semibold text-foreground whitespace-nowrap">
            Vibechat
          </h1>
        </button>

        {/* Right: Actions + Profile */}
        <nav className="flex items-center gap-2 sm:gap-4">
          {/* Desktop: Show all buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              onClick={handleChatsClick}
              variant={currentView === 'chats' ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Chats
            </Button>
            <Button
              onClick={handleLiveClick}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Radio className="h-4 w-4" />
              Live
            </Button>
            <Button
              onClick={handleVideosClick}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Video className="h-4 w-4" />
              Videos
            </Button>
            <Button
              onClick={handleContactsClick}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Contact className="h-4 w-4" />
              Contacts
            </Button>
          </div>

          {/* Mobile: Show overflow menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreVertical className="h-5 w-5" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleChatsClick}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chats
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLiveClick}>
                  <Radio className="mr-2 h-4 w-4" />
                  Live
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleVideosClick}>
                  <Video className="mr-2 h-4 w-4" />
                  Videos
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleContactsClick}>
                  <Contact className="mr-2 h-4 w-4" />
                  Contacts
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Profile Area */}
          {!isAuthenticated ? (
            <Button
              onClick={onOpenAuth}
              disabled={isLoggingIn}
              size="sm"
              className="gap-2"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          ) : profileLoading ? (
            <div className="flex items-center gap-2 px-3 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : userProfile ? (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              <Avatar className="h-8 w-8">
                {userProfile.profilePicture ? (
                  <AvatarImage
                    src={userProfile.profilePicture.getDirectURL()}
                    alt={userProfile.fullName}
                  />
                ) : (
                  <AvatarFallback className="text-xs">
                    {getInitials(userProfile.fullName)}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="text-sm font-medium hidden sm:inline">
                {userProfile.fullName}
              </span>
            </button>
          ) : isFetched ? (
            <Button onClick={onOpenAuth} size="sm" variant="outline" className="gap-2">
              <User className="h-4 w-4" />
              Complete Profile
            </Button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
