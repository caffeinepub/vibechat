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
