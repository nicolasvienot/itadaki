import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AppState {
  activeDestinationId: string | null;
  onboardingComplete: boolean;
  setActiveDestination: (id: string) => void;
  setOnboardingComplete: () => void;
  hydrate: () => Promise<void>;
  reset: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  activeDestinationId: null,
  onboardingComplete: false,

  setActiveDestination: (id) => {
    set({ activeDestinationId: id });
    SecureStore.setItemAsync('activeDestinationId', id);
  },

  setOnboardingComplete: () => {
    set({ onboardingComplete: true });
    SecureStore.setItemAsync('onboardingComplete', 'true');
  },

  hydrate: async () => {
    const [activeId, onboarding] = await Promise.all([
      SecureStore.getItemAsync('activeDestinationId'),
      SecureStore.getItemAsync('onboardingComplete'),
    ]);
    set({
      activeDestinationId: activeId ?? null,
      onboardingComplete: onboarding === 'true',
    });
  },

  reset: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync('activeDestinationId'),
      SecureStore.deleteItemAsync('onboardingComplete'),
    ]);
    set({ activeDestinationId: null, onboardingComplete: false });
  },
}));
