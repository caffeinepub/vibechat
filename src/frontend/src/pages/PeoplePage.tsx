import { useState } from 'react';
import { useGetAllUsers, useGetFollowing, useGetFollowers, useFollowUser, useUnfollowUser, useIsFollowing } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Users, UserPlus, UserMinus, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { UserProfile } from '../backend';

function UserCard({ user, userPrincipal }: { user: UserProfile; userPrincipal: string }) {
  const { identity } = useInternetIdentity();
  const isFollowing = useIsFollowing(userPrincipal);
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  const currentUserPrincipal = identity?.getPrincipal().toString();
  const isCurrentUser = currentUserPrincipal === userPrincipal;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowMutation.mutateAsync(userPrincipal);
        toast.success('Unfollowed successfully');
      } else {
        await followMutation.mutateAsync(userPrincipal);
        toast.success('Following successfully');
      }
    } catch (error) {
      toast.error('Failed to update follow status');
    }
  };

  const isLoading = followMutation.isPending || unfollowMutation.isPending;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            {user.profilePicture ? (
              <AvatarImage
                src={user.profilePicture.getDirectURL()}
                alt={user.fullName}
              />
            ) : (
              <AvatarFallback className="text-lg">
                {getInitials(user.fullName)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{user.fullName}</h3>
            <p className="text-sm text-muted-foreground truncate">{user.phoneNumber}</p>
          </div>
          {!isCurrentUser && (
            <Button
              onClick={handleFollowToggle}
              disabled={isLoading}
              variant={isFollowing ? 'outline' : 'default'}
              size="sm"
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isFollowing ? (
                <>
                  <UserMinus className="h-4 w-4" />
                  Unfollow
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Follow
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function UserListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function PeoplePage() {
  const { data: allUsers, isLoading: usersLoading, isError: usersError } = useGetAllUsers();
  const { data: following } = useGetFollowing();
  const { data: followers } = useGetFollowers();
  const { identity } = useInternetIdentity();

  const currentUserPrincipal = identity?.getPrincipal().toString();

  // Filter out current user from all users
  const otherUsers = allUsers?.filter(user => {
    // We need to match by phone number since we don't have principal in UserProfile
    // This is a limitation of the current backend structure
    return true; // For now, show all users
  }) || [];

  const followingUsers = allUsers?.filter(user => {
    // Match users that are in following list
    // Note: This is a mock implementation
    return false; // Will be populated when backend is ready
  }) || [];

  const followerUsers = allUsers?.filter(user => {
    // Match users that are in followers list
    // Note: This is a mock implementation
    return false; // Will be populated when backend is ready
  }) || [];

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">People</h1>
        <p className="text-muted-foreground">
          Discover and connect with other users
        </p>
      </div>

      <Alert className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          Following and followers features are currently in development. You can follow users, but the backend integration is pending.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="discover" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover" className="gap-2">
            <Users className="h-4 w-4" />
            Discover
          </TabsTrigger>
          <TabsTrigger value="following" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Following ({following?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="followers" className="gap-2">
            <UserMinus className="h-4 w-4" />
            Followers ({followers?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-4">
          {usersLoading ? (
            <UserListSkeleton />
          ) : usersError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load users. This feature requires admin permissions in the current backend.
              </AlertDescription>
            </Alert>
          ) : otherUsers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No users found</h3>
                <p className="text-muted-foreground">
                  Check back later to discover new people
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {otherUsers.map((user, idx) => (
                <UserCard key={idx} user={user} userPrincipal={`user-${idx}`} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="following" className="space-y-4">
          {followingUsers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <UserPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Not following anyone yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start following people to see them here
                </p>
                <Button onClick={() => document.querySelector('[value="discover"]')?.dispatchEvent(new Event('click'))}>
                  Discover People
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {followingUsers.map((user, idx) => (
                <UserCard key={idx} user={user} userPrincipal={`user-${idx}`} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="followers" className="space-y-4">
          {followerUsers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <UserMinus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No followers yet</h3>
                <p className="text-muted-foreground">
                  When people follow you, they'll appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {followerUsers.map((user, idx) => (
                <UserCard key={idx} user={user} userPrincipal={`user-${idx}`} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
