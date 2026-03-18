import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, BorderRadius } from '../../constants/theme';
import { DifficultyBadge } from '../../components/DifficultyBadge';
import { useVocabulary } from '../../hooks/useVocabulary';
import { Difficulty, VocabSet } from '../../types';

const DIFFICULTIES: Difficulty[] = ['A1.1', 'A1.2', 'A2.1'];

export default function VocabularyScreen() {
  const { allSets, refresh } = useVocabulary();
  const router = useRouter();
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | 'all'>('all');

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const filteredSets =
    filterDifficulty === 'all'
      ? allSets
      : allSets.filter((s) => s.difficulty === filterDifficulty);

  const renderSet = ({ item }: { item: VocabSet }) => (
    <TouchableOpacity
      style={styles.setCard}
      onPress={() => router.push(`/vocabulary/${item.id}`)}
    >
      <View style={styles.setHeader}>
        <View style={styles.setNameRow}>
          {item.isCustom && (
            <Ionicons name="create-outline" size={16} color={Colors.accent} />
          )}
          <Text style={styles.setName}>{item.name}</Text>
        </View>
        <DifficultyBadge difficulty={item.difficulty} />
      </View>
      <View style={styles.setMeta}>
        <View style={styles.topicBadge}>
          <Text style={styles.topicText}>{item.topic}</Text>
        </View>
        <Text style={styles.wordCount}>{item.words.length} words</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterButton, filterDifficulty === 'all' && styles.filterActive]}
          onPress={() => setFilterDifficulty('all')}
        >
          <Text
            style={[styles.filterText, filterDifficulty === 'all' && styles.filterTextActive]}
          >
            All
          </Text>
        </TouchableOpacity>
        {DIFFICULTIES.map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.filterButton, filterDifficulty === d && styles.filterActive]}
            onPress={() => setFilterDifficulty(d)}
          >
            <Text
              style={[styles.filterText, filterDifficulty === d && styles.filterTextActive]}
            >
              {d}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredSets}
        renderItem={renderSet}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/custom/create-set')}
          >
            <Ionicons name="add-circle" size={24} color={Colors.accent} />
            <Text style={styles.addText}>Create Custom Set</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterRow: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surface,
  },
  filterActive: {
    backgroundColor: Colors.accent,
  },
  filterText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  filterTextActive: {
    color: Colors.text,
  },
  list: {
    padding: Spacing.md,
    paddingTop: 0,
    paddingBottom: 40,
  },
  setCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  setHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  setNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  setName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  setMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  topicBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  topicText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  wordCount: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.accent + '40',
    borderStyle: 'dashed',
    marginTop: Spacing.sm,
  },
  addText: {
    fontSize: FontSize.md,
    color: Colors.accent,
    fontWeight: '600',
  },
});
