import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from './context/AuthContext';

const AuthenticatedStack = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SupervisorHome" />
    <Stack.Screen name="WorkerHome" />
  </Stack>
);

const UnauthenticatedStack = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="index" />
    <Stack.Screen name="SupervisorLogin" />
    <Stack.Screen name="WorkerLogin" />
  </Stack>
);

export default function RootLayout() {
  const { userRole } = useAuth();

  return (
    <AuthProvider>
      {userRole ? <AuthenticatedStack /> : <UnauthenticatedStack />}
    </AuthProvider>
  );
}