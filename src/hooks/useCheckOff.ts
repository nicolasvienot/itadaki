import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

interface CheckOffInput {
  dishId: string;
  destinationId: string;
  rating?: number;
  note?: string;
  localPhotoUri?: string;
}

export function useCheckOff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CheckOffInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let photoUrl: string | undefined;

      if (input.localPhotoUri) {
        const path = `${user.id}/${input.dishId}_${Date.now()}.jpg`;
        const response = await fetch(input.localPhotoUri);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from('dish-photos')
          .upload(path, blob, { contentType: 'image/jpeg', upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage.from('dish-photos').getPublicUrl(path);
          photoUrl = data.publicUrl;
        }
      }

      const { data, error } = await supabase
        .from('dish_checks')
        .upsert(
          {
            user_id: user.id,
            dish_id: input.dishId,
            destination_id: input.destinationId,
            rating: input.rating ?? null,
            note: input.note ?? null,
            photo_url: photoUrl ?? null,
            tried_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,dish_id' }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: ['checks', input.destinationId] });
      queryClient.invalidateQueries({ queryKey: ['passport'] });
    },
  });
}
