import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@bookeeper/ui-tokens';
import { loadFromStorage, useAuth } from '../src/stores/auth-store';
import { me } from '../src/api/auth';
import { signOut, setAuthed } from '../src/stores/auth-store';

export default function RootLayout() {
  const auth = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    void (async () => {
      await loadFromStorage();
    })();
  }, []);

  // Refresh the current user once we have a token on boot.
  useEffect(() => {
    if (auth.status !== 'authenticated') return;
    if (auth.user.id) return;
    void (async () => {
      try {
        const user = await me();
        await setAuthed(user, auth.token);
      } catch {
        await signOut();
      }
    })();
  }, [auth]);

  // Route based on auth state.
  useEffect(() => {
    if (auth.status === 'loading') return;
    const inAuthGroup = segments[0] === '(auth)';
    if (auth.status === 'unauthenticated' && !inAuthGroup) {
      router.replace('/(auth)/phone');
    } else if (auth.status === 'authenticated' && inAuthGroup) {
      router.replace('/');
    }
  }, [auth.status, segments, router]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.pitch },
          animation: 'slide_from_right',
        }}
      />
    </SafeAreaProvider>
  );
}
