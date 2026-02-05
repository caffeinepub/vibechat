import { BrandLogo } from './BrandLogo';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { User, Loader2, Video, Radio, MoreVertical, MessageSquare, Users, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { toast } from 'sonner';

type Section = 'chats' | 'groups' | 'status' | 'live' | 'videos';

interface AppHeaderProps {
  onOpenAuth: () => void;
  onOpenContacts: () => void;
  currentSection: Section | null;
  onSectionChange: (section: Section) => void;
}

export function AppHeader({ onOpenAuth, currentSection, onSectionChange }: AppHeaderProps) {
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

  const handleSectionClick = (section: Section) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to access this section');
      return;
    }
    onSectionChange(section);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <BrandLogo size="md" />
          <h1 className="text-xl font-semibold text-foreground whitespace-nowrap">
            Vibechat
          </h1>
        </div>

        {/* Center: Section Navigation (Desktop) */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1">
            <Button
              onClick={() => handleSectionClick('chats')}
              variant={currentSection === 'chats' ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Chats
            </Button>
            <Button
              onClick={() => handleSectionClick('groups')}
              variant={currentSection === 'groups' ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Groups
            </Button>
            <Button
              onClick={() => handleSectionClick('status')}
              variant={currentSection === 'status' ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Status
            </Button>
            <Button
              onClick={() => handleSectionClick('live')}
              variant={currentSection === 'live' ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <Radio className="h-4 w-4" />
              Live
            </Button>
            <Button
              onClick={() => handleSectionClick('videos')}
              variant={currentSection === 'videos' ? 'default' : 'ghost'}
              size="sm"
              className="gap-2"
            >
              <Video className="h-4 w-4" />
              Videos
            </Button>
          </nav>
        )}

        {/* Right: Mobile Menu + Profile */}
        <div className="flex items-center gap-2">
          {/* Mobile: Show overflow menu */}
          {isAuthenticated && (
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <MoreVertical className="h-5 w-5" />
                    <span className="sr-only">Navigation menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleSectionClick('chats')}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chats
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSectionClick('groups')}>
                    <Users className="mr-2 h-4 w-4" />
                    Groups
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSectionClick('status')}>
                    <Eye className="mr-2 h-4 w-4" />
                    Status
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSectionClick('live')}>
                    <Radio className="mr-2 h-4 w-4" />
                    Live
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSectionClick('videos')}>
                    <Video className="mr-2 h-4 w-4" />
                    Videos
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

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
        </div>
      </div>
    </header>
  );
}
