import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';

interface CalendarHeatmapProps {
  activityDates: string[];
}

export function CalendarHeatmap({ activityDates }: CalendarHeatmapProps) {
  const today = new Date();
  const days: { date: string; active: boolean }[] = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({ date: dateStr, active: activityDates.includes(dateStr) });
  }

  const weeks: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Last 30 Days</Text>
      <View style={styles.grid}>
        {weeks.map((week, wi) => (
          <View key={wi} style={styles.week}>
            {week.map((day) => (
              <View
                key={day.date}
                style={[
                  styles.day,
                  day.active ? styles.dayActive : styles.dayInactive,
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  grid: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  week: {
    gap: 6,
  },
  day: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  dayActive: {
    backgroundColor: Colors.accent,
  },
  dayInactive: {
    backgroundColor: Colors.surfaceLight,
  },
});
