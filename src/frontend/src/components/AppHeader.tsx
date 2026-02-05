import { BrandLogo } from './BrandLogo';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { User, Loader2 } from 'lucide-react';

interface AppHeaderProps {
  onOpenAuth: () => void;
}

export function AppHeader({ onOpenAuth }: AppHeaderProps) {
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <BrandLogo size="md" />
        </div>

        <nav className="flex items-center gap-4">
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
