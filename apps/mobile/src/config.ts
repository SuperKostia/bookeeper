import Constants from 'expo-constants';

/**
 * API base URL. Configure via EXPO_PUBLIC_API_URL in .env for real devices,
 * otherwise defaults to localhost for simulators.
 */
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.hostUri
    ? `http://${Constants.expoConfig.hostUri.split(':')[0]}:3001`
    : 'http://localhost:3001');
