import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { Principal } from '@dfinity/principal';
import type { UserProfile, Message } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getCallerUserProfile();
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('Please sign in to view your profile');
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.saveCallerUserProfile(profile);
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('Please sign in to save your profile');
        }
        if (error.message?.includes('Phone number is already taken')) {
          throw new Error('This phone number is already registered');
        }
        throw new Error('Failed to save profile. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useCheckPhoneNumberAvailability() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (phoneNumber: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.checkPhoneNumberAvailability(phoneNumber);
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('Please sign in to check phone availability');
        }
        throw error;
      }
    },
  });
}

export function useHasPassword() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['hasPassword'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.hasPassword();
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          return false;
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useSetPassword() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.setPassword(password);
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('Please sign in to set a password');
        }
        throw new Error('Failed to set password. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hasPassword'] });
    },
  });
}

export function useChangePassword() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.changePassword(oldPassword, newPassword);
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('Please sign in to change your password');
        }
        if (error.message?.includes('Incorrect old password')) {
          throw new Error('Current password is incorrect');
        }
        if (error.message?.includes('Password not set')) {
          throw new Error('No password is currently set');
        }
        throw new Error('Failed to change password. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hasPassword'] });
    },
  });
}

export function useMatchContacts() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (phoneNumbers: string[]) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getMatchingContacts(phoneNumbers);
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('Please sign in to match contacts');
        }
        throw new Error('Failed to match contacts. Please try again.');
      }
    },
  });
}

// Chat-related queries

export function useGetUserConversations() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['userConversations'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getUserConversations();
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('Please sign in to view conversations');
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useCreateConversation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (participants: Principal[]) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.createConversation(participants);
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('Please sign in to create conversations');
        }
        if (error.message?.includes('at least two participants')) {
          throw new Error('A conversation requires at least two participants');
        }
        throw new Error('Failed to create conversation. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userConversations'] });
    },
  });
}

export function useGetMessages(conversationId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getMessages(conversationId);
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('You are not authorized to view this conversation');
        }
        if (error.message?.includes('not found')) {
          throw new Error('Conversation not found');
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && !!conversationId,
    retry: false,
    refetchInterval: 3000, // Poll every 3 seconds for new messages
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, text, attachments }: { conversationId: string; text: string; attachments: any[] }) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('Not authenticated');
      
      try {
        const message = {
          sender: identity.getPrincipal(),
          text,
          timestamp: BigInt(Date.now() * 1000000), // Convert to nanoseconds
          attachments,
        };
        await actor.sendMessage(conversationId, message);
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('You are not authorized to send messages in this conversation');
        }
        if (error.message?.includes('not found')) {
          throw new Error('Conversation not found');
        }
        throw new Error('Failed to send message. Please try again.');
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
    },
  });
}

export function useGetConversationParticipants(conversationId: string) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<UserProfile[]>({
    queryKey: ['conversationParticipants', conversationId],
    queryFn: async () => {
      if (!actor || !identity) throw new Error('Actor not available');
      try {
        const messages = await actor.getMessages(conversationId);
        if (messages.length === 0) return [];
        
        // Get unique participants (excluding current user)
        const currentUserPrincipal = identity.getPrincipal().toString();
        const participantPrincipals = Array.from(
          new Set(
            messages
              .map(m => m.sender.toString())
              .filter(p => p !== currentUserPrincipal)
          )
        );

        // Fetch profiles for other participants
        const profiles = await Promise.all(
          participantPrincipals.map(async (principalStr) => {
            try {
              const principal = Principal.fromText(principalStr);
              return await actor.getUserProfile(principal);
            } catch {
              return null;
            }
          })
        );

        return profiles.filter((p): p is UserProfile => p !== null);
      } catch (error: any) {
        return [];
      }
    },
    enabled: !!actor && !actorFetching && !!conversationId && !!identity,
    retry: false,
  });
}

// Social features - Following/Followers (Mock implementation until backend is ready)

export function useGetAllUsers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        // Note: This requires admin permission in current backend
        // In production, backend should have a public endpoint to discover users
        return await actor.getAllUserProfiles();
      } catch (error: any) {
        // Return empty array if unauthorized (non-admin users)
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Mock follow/unfollow until backend implements these
export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: string) => {
      // TODO: Replace with actual backend call when implemented
      // await actor.followUser(Principal.fromText(userPrincipal));
      console.log('Follow user (mock):', userPrincipal);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Store in localStorage as mock
      const following = JSON.parse(localStorage.getItem('following') || '[]');
      if (!following.includes(userPrincipal)) {
        following.push(userPrincipal);
        localStorage.setItem('following', JSON.stringify(following));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: string) => {
      // TODO: Replace with actual backend call when implemented
      // await actor.unfollowUser(Principal.fromText(userPrincipal));
      console.log('Unfollow user (mock):', userPrincipal);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from localStorage as mock
      const following = JSON.parse(localStorage.getItem('following') || '[]');
      const updated = following.filter((p: string) => p !== userPrincipal);
      localStorage.setItem('following', JSON.stringify(updated));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
    },
  });
}

export function useGetFollowing() {
  const { identity } = useInternetIdentity();

  return useQuery<string[]>({
    queryKey: ['following'],
    queryFn: async () => {
      // TODO: Replace with actual backend call when implemented
      // return await actor.getFollowing(identity.getPrincipal());
      
      // Mock implementation using localStorage
      return JSON.parse(localStorage.getItem('following') || '[]');
    },
    enabled: !!identity,
  });
}

export function useGetFollowers() {
  const { identity } = useInternetIdentity();

  return useQuery<string[]>({
    queryKey: ['followers'],
    queryFn: async () => {
      // TODO: Replace with actual backend call when implemented
      // return await actor.getFollowers(identity.getPrincipal());
      
      // Mock implementation - return empty for now
      return [];
    },
    enabled: !!identity,
  });
}

export function useIsFollowing(userPrincipal: string) {
  const { data: following } = useGetFollowing();
  return following?.includes(userPrincipal) || false;
}

// Mock like/unlike until backend implements these
export function useLikeMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, messageIndex }: { conversationId: string; messageIndex: number }) => {
      // TODO: Replace with actual backend call when implemented
      // await actor.likeMessage(conversationId, BigInt(messageIndex));
      console.log('Like message (mock):', conversationId, messageIndex);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Store in localStorage as mock
      const likes = JSON.parse(localStorage.getItem('messageLikes') || '{}');
      const key = `${conversationId}_${messageIndex}`;
      if (!likes[key]) {
        likes[key] = [];
      }
      const currentUser = 'current-user'; // Would be identity.getPrincipal().toString()
      if (!likes[key].includes(currentUser)) {
        likes[key].push(currentUser);
        localStorage.setItem('messageLikes', JSON.stringify(likes));
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messageLikes', variables.conversationId] });
    },
  });
}

export function useUnlikeMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, messageIndex }: { conversationId: string; messageIndex: number }) => {
      // TODO: Replace with actual backend call when implemented
      // await actor.unlikeMessage(conversationId, BigInt(messageIndex));
      console.log('Unlike message (mock):', conversationId, messageIndex);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Remove from localStorage as mock
      const likes = JSON.parse(localStorage.getItem('messageLikes') || '{}');
      const key = `${conversationId}_${messageIndex}`;
      if (likes[key]) {
        const currentUser = 'current-user';
        likes[key] = likes[key].filter((u: string) => u !== currentUser);
        localStorage.setItem('messageLikes', JSON.stringify(likes));
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messageLikes', variables.conversationId] });
    },
  });
}

export function useGetMessageLikes(conversationId: string) {
  return useQuery<Record<number, string[]>>({
    queryKey: ['messageLikes', conversationId],
    queryFn: async () => {
      // TODO: Replace with actual backend call when implemented
      // const allLikes = await actor.getConversationLikes(conversationId);
      
      // Mock implementation using localStorage
      const allLikes = JSON.parse(localStorage.getItem('messageLikes') || '{}');
      const conversationLikes: Record<number, string[]> = {};
      
      Object.keys(allLikes).forEach(key => {
        if (key.startsWith(`${conversationId}_`)) {
          const messageIndex = parseInt(key.split('_')[1]);
          conversationLikes[messageIndex] = allLikes[key];
        }
      });
      
      return conversationLikes;
    },
  });
}

export function useHasLikedMessage(conversationId: string, messageIndex: number) {
  const { data: likes } = useGetMessageLikes(conversationId);
  const currentUser = 'current-user'; // Would be identity.getPrincipal().toString()
  return likes?.[messageIndex]?.includes(currentUser) || false;
}
