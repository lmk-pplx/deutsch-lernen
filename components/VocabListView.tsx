import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { VocabWord } from '../types';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';

interface VocabListViewProps {
  words: VocabWord[];
}

export function VocabListView({ words }: VocabListViewProps) {
  const renderItem = ({ item }: { item: VocabWord }) => (
    <View style={styles.card}>
      <View style={styles.wordRow}>
        <Text style={styles.german}>{item.german}</Text>
        <Text style={styles.english}>{item.english}</Text>
      </View>
      {item.phonetic && (
        <Text style={styles.phonetic}>[{item.phonetic}]</Text>
      )}
      <Text style={styles.example}>{item.example}</Text>
    </View>
  );

  return (
    <FlatList
      data={words}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: Spacing.md,
    gap: Spacing.sm,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  wordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  german: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.accent,
    flex: 1,
  },
  english: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'right',
    flex: 1,
  },
  phonetic: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  example: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});
