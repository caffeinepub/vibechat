import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function usePublishReadinessCheck() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['publishReadiness'],
    queryFn: async () => {
      if (!actor) {
        throw new Error('Actor not initialized');
      }
      const principal = await actor.checkCanisterStatus();
      return {
        principal: principal.toString(),
        status: 'ready',
      };
    },
    enabled: !!actor && !isFetching,
    retry: 2,
  });
}
