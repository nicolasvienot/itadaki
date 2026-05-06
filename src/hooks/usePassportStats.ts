import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useDestinations } from './useDestinations';
import { DishCheck } from '../types';
import { computeStats } from '../utils/passport';

export function usePassportStats() {
  const destinationsQuery = useDestinations();

  return useQuery({
    queryKey: ['passport'],
    queryFn: async () => {
      const destinations = destinationsQuery.data!;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return computeStats([], destinations);

      const { data, error } = await supabase
        .from('dish_checks')
        .select('*')
        .eq('user_id', user.id)
        .order('tried_at', { ascending: false });

      if (error) throw error;
      return computeStats((data ?? []) as DishCheck[], destinations);
    },
    enabled: !!destinationsQuery.data,
  });
}
