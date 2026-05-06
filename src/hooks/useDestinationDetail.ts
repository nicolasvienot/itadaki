import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useDestinations } from './useDestinations';
import { DishCheck } from '../types';

export function useDestinationDetail(destinationId: string) {
  const destinationsQuery = useDestinations();

  const checksQuery = useQuery({
    queryKey: ['checks', destinationId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [] as DishCheck[];

      const { data, error } = await supabase
        .from('dish_checks')
        .select('*')
        .eq('user_id', user.id)
        .eq('destination_id', destinationId);

      if (error) throw error;
      return (data ?? []) as DishCheck[];
    },
    enabled: !!destinationId,
  });

  const destination = destinationsQuery.data?.find((d) => d.id === destinationId);

  const checksByDishId = (checksQuery.data ?? []).reduce<Record<string, DishCheck>>(
    (acc, check) => {
      acc[check.dish_id] = check;
      return acc;
    },
    {}
  );

  return {
    destination,
    checks: checksByDishId,
    isLoading: destinationsQuery.isLoading || checksQuery.isLoading,
  };
}
