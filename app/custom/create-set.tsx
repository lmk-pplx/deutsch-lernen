import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, BorderRadius } from '../../constants/theme';
import { createCustomSet } from '../../store/customVocab';
import { Difficulty } from '../../types';

const DIFFICULTIES: { key: Difficulty; label: string }[] = [
  { key: 'A1.1', label: 'A1.1 - Beginner' },
  { key: 'A1.2', label: 'A1.2 - Elementary' },
  { key: 'A2.1', label: 'A2.1 - Pre-Intermediate' },
];

const TOPICS = ['Basics', 'Food', 'Travel', 'Daily Life', 'People', 'Nature', 'Health', 'Lifestyle', 'Work', 'Custom'];

export default function CreateSetScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('Custom');
  const [difficulty, setDifficulty] = useState<Difficulty>('A1.1');

  const handleCreate = async () => {
    if (!name.trim()) return;
    const newSet = await createCustomSet(name.trim(), topic, difficulty);
    router.replace({ pathname: '/vocabulary/[id]', params: { id: newSet.id } });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Set Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Kitchen Vocabulary"
          placeholderTextColor={Colors.textMuted}
          autoFocus
        />

        <Text style={styles.label}>Difficulty</Text>
        <View style={styles.optionRow}>
          {DIFFICULTIES.map((d) => (
            <TouchableOpacity
              key={d.key}
              style={[styles.optionButton, difficulty === d.key && styles.optionActive]}
              onPress={() => setDifficulty(d.key)}
            >
              <Text
                style={[styles.optionText, difficulty === d.key && styles.optionTextActive]}
              >
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Topic</Text>
        <View style={styles.topicGrid}>
          {TOPICS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.topicButton, topic === t && styles.topicActive]}
              onPress={() => setTopic(t)}
            >
              <Text style={[styles.topicText, topic === t && styles.topicTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.createButton, !name.trim() && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={!name.trim()}
        >
          <Ionicons name="add-circle" size={24} color={Colors.text} />
          <Text style={styles.createButtonText}>Create Set</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionRow: {
    gap: Spacing.sm,
  },
  optionButton: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent + '15',
  },
  optionText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  optionTextActive: {
    color: Colors.accent,
    fontWeight: '600',
  },
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  topicButton: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topicActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent + '15',
  },
  topicText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  topicTextActive: {
    color: Colors.accent,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  createButtonDisabled: {
    opacity: 0.4,
  },
  createButtonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
});
