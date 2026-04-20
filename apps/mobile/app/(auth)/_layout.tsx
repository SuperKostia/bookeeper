import { Stack } from 'expo-router';
import { colors } from '@bookeeper/ui-tokens';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.pitch },
      }}
    />
  );
}
