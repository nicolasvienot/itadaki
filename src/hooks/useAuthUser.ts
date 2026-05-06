import { useEffect, useSyncExternalStore } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Module-level cache so auth state persists across component mounts.
// Without this, every Settings open re-runs getUser() and flashes the anon state.
type AuthState = { user: User | null; ready: boolean };
let state: AuthState = { user: null, ready: false };
const listeners = new Set<() => void>();

function setState(next: Partial<AuthState>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

let initialized = false;
function initialize() {
  if (initialized) return;
  initialized = true;

  // Seed from local session immediately (sync read from secure store).
  supabase.auth.getSession().then(({ data }) => {
    setState({ user: data.session?.user ?? null, ready: true });
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    setState({ user: session?.user ?? null, ready: true });
  });
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};
const getSnapshot = () => state;

export function useAuthUser() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    initialize();
  }, []);

  return {
    user: snap.user,
    isAnonymous: snap.user?.is_anonymous ?? true,
    loading: !snap.ready,
  };
}
