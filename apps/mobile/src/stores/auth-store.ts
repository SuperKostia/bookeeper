import { useSyncExternalStore } from 'react';
import type { User } from '@bookeeper/types';
import { storage } from './storage';

const TOKEN_KEY = 'bookeeper.token';

type AuthState =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'authenticated'; user: User; token: string };

let state: AuthState = { status: 'loading' };
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export async function getToken(): Promise<string | null> {
  if (state.status === 'authenticated') return state.token;
  return storage.get(TOKEN_KEY);
}

export async function loadFromStorage(): Promise<void> {
  const token = await storage.get(TOKEN_KEY);
  if (!token) {
    state = { status: 'unauthenticated' };
  } else {
    // Mark as authenticated with an empty user; the app bootstrap will
    // refresh the real user via /auth/me and call setAuthed().
    state = { status: 'authenticated', user: {} as User, token };
  }
  emit();
}

export async function setAuthed(user: User, token: string) {
  await storage.set(TOKEN_KEY, token);
  state = { status: 'authenticated', user, token };
  emit();
}

export async function signOut() {
  await storage.del(TOKEN_KEY);
  state = { status: 'unauthenticated' };
  emit();
}

export function useAuth(): AuthState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
}
