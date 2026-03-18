import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Colors, FontSize, Spacing } from '../../constants/theme';
import { ConversationView } from '../../components/ConversationView';
import { conversations } from '../../data/conversations';
import { recordActivity } from '../../store/progress';

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversation = conversations.find((c) => c.id === id);

  if (!conversation) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Conversation not found</Text>
      </View>
    );
  }

  const handleComplete = async () => {
    await recordActivity();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: conversation.title }} />
      <ConversationView conversation={conversation} onComplete={handleComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
});
