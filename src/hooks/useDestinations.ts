import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Destination } from '../types';

export function useDestinations() {
  return useQuery({
    queryKey: ['destinations'],
    queryFn: async (): Promise<Destination[]> => {
      const [{ data: dests, error: destErr }, { data: dishes, error: dishErr }] = await Promise.all([
        supabase.from('destinations').select('*').order('display_order'),
        supabase.from('dishes').select('*').order('display_order'),
      ]);

      if (destErr) throw destErr;
      if (dishErr) throw dishErr;

      return (dests ?? []).map((dest) => ({
        id: dest.id,
        name: dest.name,
        country: dest.country,
        coverPhotoUrl: dest.cover_photo_url,
        shortDescription: dest.short_description,
        dishes: (dishes ?? [])
          .filter((d) => d.destination_id === dest.id)
          .map((d) => ({
            id: d.id,
            destinationId: d.destination_id,
            name: d.name,
            localName: d.local_name,
            photoUrl: d.photo_url,
            oneLiner: d.one_liner,
            funFact: d.fun_fact ?? undefined,
          })),
      }));
    },
    staleTime: 60 * 60 * 1000,
  });
}
