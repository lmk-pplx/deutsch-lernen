import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, BorderRadius } from '../../constants/theme';
import { VocabListView } from '../../components/VocabListView';
import { FlashcardView } from '../../components/FlashcardView';
import { QuizView } from '../../components/QuizView';
import { DifficultyBadge } from '../../components/DifficultyBadge';
import { useVocabulary } from '../../hooks/useVocabulary';
import { useProgress } from '../../hooks/useProgress';
import { ViewMode, QuizResult } from '../../types';
import { recordActivity } from '../../store/progress';
import { deleteCustomSet } from '../../store/customVocab';

export default function VocabSetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { allSets, refresh: refreshVocab } = useVocabulary();
  const { logQuiz, logWords, logActivity } = useProgress();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useFocusEffect(
    useCallback(() => {
      refreshVocab();
    }, [refreshVocab])
  );

  const set = allSets.find((s) => s.id === id);

  if (!set) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Set not found</Text>
      </View>
    );
  }

  if (set.words.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Stack.Screen options={{ title: set.name }} />
        <Ionicons name="document-outline" size={64} color={Colors.textMuted} />
        <Text style={styles.emptyText}>No words in this set yet</Text>
        {set.isCustom && (
          <TouchableOpacity
            style={styles.addWordsButton}
            onPress={() => router.push({ pathname: '/custom/add-word', params: { setId: set.id } })}
          >
            <Ionicons name="add-circle" size={20} color={Colors.text} />
            <Text style={styles.addWordsText}>Add Words</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  const handleFlashcardComplete = async (knownIds: string[]) => {
    await logWords(knownIds.length);
    await logActivity();
  };

  const handleQuizComplete = async (result: QuizResult) => {
    await logQuiz(result.correct, result.total);
  };

  const handleDelete = () => {
    Alert.alert('Delete Set', `Delete "${set.name}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteCustomSet(set.id);
          router.back();
        },
      },
    ]);
  };

  const modes: { key: ViewMode; label: string; icon: string }[] = [
    { key: 'list', label: 'List', icon: 'list' },
    { key: 'flashcard', label: 'Cards', icon: 'albums' },
    { key: 'quiz', label: 'Quiz', icon: 'help-circle' },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: set.name }} />

      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <DifficultyBadge difficulty={set.difficulty} />
          <Text style={styles.topicText}>{set.topic}</Text>
          <Text style={styles.wordCount}>{set.words.length} words</Text>
        </View>

        <View style={styles.headerActions}>
          {set.isCustom && (
            <>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push({ pathname: '/custom/add-word', params: { setId: set.id } })}
              >
                <Ionicons name="add" size={22} color={Colors.accent} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={20} color={Colors.error} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.modeRow}>
        {modes.map((mode) => (
          <TouchableOpacity
            key={mode.key}
            style={[styles.modeButton, viewMode === mode.key && styles.modeActive]}
            onPress={() => setViewMode(mode.key)}
          >
            <Ionicons
              name={mode.icon as any}
              size={18}
              color={viewMode === mode.key ? Colors.text : Colors.textMuted}
            />
            <Text
              style={[styles.modeText, viewMode === mode.key && styles.modeTextActive]}
            >
              {mode.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {viewMode === 'list' && <VocabListView words={set.words} />}
        {viewMode === 'flashcard' && (
          <FlashcardView words={set.words} onComplete={handleFlashcardComplete} />
        )}
        {viewMode === 'quiz' && set.words.length >= 4 && (
          <QuizView words={set.words} onComplete={handleQuizComplete} />
        )}
        {viewMode === 'quiz' && set.words.length < 4 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Need at least 4 words for a quiz</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    paddingBottom: 0,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  wordCount: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  modeRow: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
  },
  modeActive: {
    backgroundColor: Colors.accent,
  },
  modeText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  modeTextActive: {
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  addWordsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  addWordsText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
});
