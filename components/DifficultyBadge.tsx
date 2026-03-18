import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Difficulty } from '../types';
import { Colors, FontSize, BorderRadius, Spacing } from '../constants/theme';

const difficultyColors: Record<Difficulty, string> = {
  'A1.1': '#4CAF50',
  'A1.2': '#FF9800',
  'A2.1': '#F44336',
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <View style={[styles.badge, { backgroundColor: difficultyColors[difficulty] + '30' }]}>
      <Text style={[styles.text, { color: difficultyColors[difficulty] }]}>{difficulty}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
});
