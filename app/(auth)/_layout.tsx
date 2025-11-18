import { Stack } from 'expo-router';
import { useAuthStatus } from '@/contexts/AuthContext';

export default function AuthLayout() {
  const { isLoading } = useAuthStatus();

  // Show loading screen while checking authentication status
  if (isLoading) {
    return null; // This will show the splash screen
  }

  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
          title: 'Register',
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          headerShown: false,
          title: 'Reset Password',
        }}
      />
    </Stack>
  );
}