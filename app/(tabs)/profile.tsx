import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, BorderRadius } from '../../constants/theme';
import { StreakDisplay } from '../../components/StreakDisplay';
import { CalendarHeatmap } from '../../components/CalendarHeatmap';
import { useProgress } from '../../hooks/useProgress';
import { resetProgress } from '../../store/progress';

export default function ProfileScreen() {
  const { progress, refresh } = useProgress();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const avgScore =
    progress.totalQuizQuestions > 0
      ? Math.round((progress.totalQuizScore / progress.totalQuizQuestions) * 100)
      : 0;

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'This will reset all your learning progress. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetProgress();
            refresh();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StreakDisplay
        currentStreak={progress.currentStreak}
        longestStreak={progress.longestStreak}
      />

      <CalendarHeatmap activityDates={progress.activityDates} />

      <Text style={styles.sectionTitle}>Statistics</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="book" size={28} color={Colors.accent} />
          <Text style={styles.statNumber}>{progress.totalWordsLearned}</Text>
          <Text style={styles.statLabel}>Words Learned</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="help-circle" size={28} color={Colors.warning} />
          <Text style={styles.statNumber}>{progress.totalQuizzesCompleted}</Text>
          <Text style={styles.statLabel}>Quizzes Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trending-up" size={28} color={Colors.success} />
          <Text style={styles.statNumber}>{avgScore}%</Text>
          <Text style={styles.statLabel}>Average Score</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="flame" size={28} color={Colors.streak} />
          <Text style={styles.statNumber}>{progress.longestStreak}</Text>
          <Text style={styles.statLabel}>Best Streak</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Ionicons name="trash-outline" size={20} color={Colors.error} />
        <Text style={styles.resetText}>Reset Progress</Text>
      </TouchableOpacity>

      <View style={styles.about}>
        <Text style={styles.aboutTitle}>Deutsch Lernen v1.0</Text>
        <Text style={styles.aboutText}>Your personal German learning companion</Text>
      </View>
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
    gap: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    flexGrow: 1,
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
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.error + '15',
  },
  resetText: {
    fontSize: FontSize.md,
    color: Colors.error,
    fontWeight: '600',
  },
  about: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  aboutTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  aboutText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
