import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@bookeeper/ui-tokens';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.pitch },
          animation: 'slide_from_right',
        }}
      />
    </>
  );
}
