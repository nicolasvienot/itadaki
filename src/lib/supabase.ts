import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

// Web uses localStorage
const WebStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
};

// SecureStore has a 2KB value limit; Supabase JWTs can exceed that,
// so we chunk large values across multiple keys.
const NativeStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    const n = await SecureStore.getItemAsync(`${key}_n`);
    if (!n) return SecureStore.getItemAsync(key);
    const chunks = await Promise.all(
      Array.from({ length: Number(n) }, (_, i) =>
        SecureStore.getItemAsync(`${key}_${i}`)
      )
    );
    return chunks.join('');
  },
  setItem: async (key: string, value: string): Promise<void> => {
    const size = 1800; // stay under 2KB limit
    if (value.length <= size) {
      await SecureStore.setItemAsync(key, value);
      return;
    }
    const chunks = Math.ceil(value.length / size);
    await SecureStore.setItemAsync(`${key}_n`, String(chunks));
    await Promise.all(
      Array.from({ length: chunks }, (_, i) =>
        SecureStore.setItemAsync(`${key}_${i}`, value.slice(i * size, (i + 1) * size))
      )
    );
  },
  removeItem: async (key: string): Promise<void> => {
    const n = await SecureStore.getItemAsync(`${key}_n`);
    if (n) {
      await Promise.all([
        SecureStore.deleteItemAsync(`${key}_n`),
        ...Array.from({ length: Number(n) }, (_, i) =>
          SecureStore.deleteItemAsync(`${key}_${i}`)
        ),
      ]);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

const StorageAdapter = Platform.OS === 'web' ? WebStorageAdapter : NativeStorageAdapter;

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: StorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export async function ensureAnonymousSession() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    await supabase.auth.signInAnonymously();
  }
}
