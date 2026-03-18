import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  compact?: boolean;
}

export function StreakDisplay({ currentStreak, longestStreak, compact }: StreakDisplayProps) {
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Ionicons name="flame" size={20} color={Colors.streak} />
        <Text style={styles.compactNumber}>{currentStreak}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.streakRow}>
        <Ionicons name="flame" size={48} color={Colors.streak} />
        <View style={styles.streakInfo}>
          <Text style={styles.streakNumber}>{currentStreak}</Text>
          <Text style={styles.streakLabel}>Day Streak</Text>
        </View>
      </View>
      <Text style={styles.longestText}>Longest: {longestStreak} days</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  streakInfo: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.streak,
  },
  streakLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: -4,
  },
  longestText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactNumber: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.streak,
  },
});
