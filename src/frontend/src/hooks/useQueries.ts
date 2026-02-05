import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '../backend';

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
