import { create } from 'zustand';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Platform-aware storage helpers
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

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
    storage.setItem('activeDestinationId', id);
  },

  setOnboardingComplete: () => {
    set({ onboardingComplete: true });
    storage.setItem('onboardingComplete', 'true');
  },

  hydrate: async () => {
    const [activeId, onboarding] = await Promise.all([
      storage.getItem('activeDestinationId'),
      storage.getItem('onboardingComplete'),
    ]);
    set({
      activeDestinationId: activeId ?? null,
      onboardingComplete: onboarding === 'true',
    });
  },

  reset: async () => {
    await Promise.all([
      storage.removeItem('activeDestinationId'),
      storage.removeItem('onboardingComplete'),
    ]);
    set({ activeDestinationId: null, onboardingComplete: false });
  },
}));
