import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, BorderRadius } from '../../constants/theme';
import { StreakDisplay } from '../../components/StreakDisplay';
import { useProgress } from '../../hooks/useProgress';
import { vocabularySets } from '../../data/vocabulary';
import { DifficultyBadge } from '../../components/DifficultyBadge';

export default function HomeScreen() {
  const { progress, refresh } = useProgress();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const avgScore =
    progress.totalQuizQuestions > 0
      ? Math.round((progress.totalQuizScore / progress.totalQuizQuestions) * 100)
      : 0;

  const quickSets = vocabularySets.slice(0, 3);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Deutsch Lernen</Text>
      <Text style={styles.subtitle}>Your German learning journey</Text>

      <StreakDisplay
        currentStreak={progress.currentStreak}
        longestStreak={progress.longestStreak}
      />

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="book-outline" size={24} color={Colors.accent} />
          <Text style={styles.statNumber}>{progress.totalWordsLearned}</Text>
          <Text style={styles.statLabel}>Words Learned</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="help-circle-outline" size={24} color={Colors.accent} />
          <Text style={styles.statNumber}>{progress.totalQuizzesCompleted}</Text>
          <Text style={styles.statLabel}>Quizzes Done</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trending-up-outline" size={24} color={Colors.accent} />
          <Text style={styles.statNumber}>{avgScore}%</Text>
          <Text style={styles.statLabel}>Avg Score</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Continue Learning</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/vocabulary')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {quickSets.map((set) => (
        <TouchableOpacity
          key={set.id}
          style={styles.setCard}
          onPress={() => router.push(`/vocabulary/${set.id}`)}
        >
          <View style={styles.setInfo}>
            <Text style={styles.setName}>{set.name}</Text>
            <View style={styles.setMeta}>
              <DifficultyBadge difficulty={set.difficulty} />
              <Text style={styles.setWordCount}>{set.words.length} words</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.speakingPromo}
        onPress={() => router.push('/(tabs)/speaking')}
      >
        <Ionicons name="chatbubbles" size={32} color={Colors.accent} />
        <View style={styles.promoText}>
          <Text style={styles.promoTitle}>Speaking Practice</Text>
          <Text style={styles.promoSubtitle}>Practice real conversations</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    marginTop: Spacing.md,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  seeAll: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: '600',
  },
  setCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  setInfo: {
    flex: 1,
  },
  setName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  setMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  setWordCount: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  speakingPromo: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.accent + '30',
  },
  promoText: {
    flex: 1,
  },
  promoTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
  promoSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});
