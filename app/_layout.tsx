import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="vocabulary/[id]"
          options={{ title: 'Vocabulary Set', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="speaking/[id]"
          options={{ title: 'Conversation', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="custom/create-set"
          options={{ title: 'Create Set', presentation: 'modal', headerBackTitle: 'Cancel' }}
        />
        <Stack.Screen
          name="custom/add-word"
          options={{ title: 'Add Word', presentation: 'modal', headerBackTitle: 'Cancel' }}
        />
      </Stack>
    </>
  );
}
