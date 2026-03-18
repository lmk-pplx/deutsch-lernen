import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Conversation, SpeakingDifficulty } from '../types';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';

interface ConversationViewProps {
  conversation: Conversation;
  onComplete: () => void;
}

export function ConversationView({ conversation, onComplete }: ConversationViewProps) {
  const [difficulty, setDifficulty] = useState<SpeakingDifficulty>('easy');
  const [practiceRole, setPracticeRole] = useState<'A' | 'B'>('B');
  const [revealedLines, setRevealedLines] = useState<Set<number>>(new Set());
  const [showTranslations, setShowTranslations] = useState(true);
  const [completed, setCompleted] = useState(false);

  const toggleReveal = (index: number) => {
    setRevealedLines((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const getDisplayText = (text: string, lineIndex: number, speaker: 'A' | 'B') => {
    if (speaker !== practiceRole) return text;
    if (difficulty === 'easy') return text;
    if (revealedLines.has(lineIndex)) return text;

    if (difficulty === 'medium') {
      const words = text.split(' ');
      if (words.length <= 1) return '_ _ _';
      return words[0] + ' ' + words.slice(1).map(() => '___').join(' ');
    }

    return '• • • • •';
  };

  const allRevealed = conversation.lines.every(
    (line, idx) =>
      line.speaker !== practiceRole ||
      difficulty === 'easy' ||
      revealedLines.has(idx)
  );

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  const handleReset = () => {
    setRevealedLines(new Set());
    setCompleted(false);
  };

  const difficultyOptions: { key: SpeakingDifficulty; label: string; icon: string }[] = [
    { key: 'easy', label: 'Easy', icon: 'book-outline' },
    { key: 'medium', label: 'Medium', icon: 'eye-outline' },
    { key: 'hard', label: 'Hard', icon: 'eye-off-outline' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.settingCard}>
        <Ionicons name="location" size={16} color={Colors.accent} />
        <Text style={styles.settingText}>{conversation.setting}</Text>
      </View>

      <View style={styles.controlsSection}>
        <Text style={styles.controlLabel}>Difficulty</Text>
        <View style={styles.difficultyRow}>
          {difficultyOptions.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.difficultyButton,
                difficulty === opt.key && styles.difficultyButtonActive,
              ]}
              onPress={() => {
                setDifficulty(opt.key);
                setRevealedLines(new Set());
                setCompleted(false);
              }}
            >
              <Ionicons
                name={opt.icon as any}
                size={16}
                color={difficulty === opt.key ? Colors.text : Colors.textMuted}
              />
              <Text
                style={[
                  styles.difficultyText,
                  difficulty === opt.key && styles.difficultyTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.roleRow}>
          <Text style={styles.controlLabel}>Practice as</Text>
          <View style={styles.roleButtons}>
            {(['A', 'B'] as const).map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.roleButton,
                  practiceRole === role && styles.roleButtonActive,
                ]}
                onPress={() => {
                  setPracticeRole(role);
                  setRevealedLines(new Set());
                  setCompleted(false);
                }}
              >
                <Text
                  style={[
                    styles.roleText,
                    practiceRole === role && styles.roleTextActive,
                  ]}
                >
                  Speaker {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.controlLabel}>Show translations</Text>
          <Switch
            value={showTranslations}
            onValueChange={setShowTranslations}
            trackColor={{ false: Colors.surfaceLight, true: Colors.accent + '50' }}
            thumbColor={showTranslations ? Colors.accent : Colors.textMuted}
          />
        </View>
      </View>

      <View style={styles.conversationContainer}>
        {conversation.lines.map((line, idx) => {
          const isHidden =
            line.speaker === practiceRole &&
            difficulty !== 'easy' &&
            !revealedLines.has(idx);
          const displayText = getDisplayText(line.german, idx, line.speaker);

          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.bubble,
                line.speaker === 'A' ? styles.bubbleA : styles.bubbleB,
              ]}
              onPress={() => isHidden && toggleReveal(idx)}
              activeOpacity={isHidden ? 0.7 : 1}
            >
              <Text style={styles.speakerLabel}>Speaker {line.speaker}</Text>
              <Text
                style={[
                  styles.germanText,
                  isHidden && styles.hiddenText,
                ]}
              >
                {displayText}
              </Text>
              {showTranslations && (
                <Text style={styles.englishText}>{line.english}</Text>
              )}
              {isHidden && (
                <Text style={styles.tapReveal}>Tap to reveal</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {!completed && (difficulty === 'easy' || allRevealed) && (
        <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.text} />
          <Text style={styles.completeButtonText}>Mark Complete</Text>
        </TouchableOpacity>
      )}

      {completed && (
        <View style={styles.completedBanner}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
          <Text style={styles.completedText}>Conversation completed</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetLink}>Practice Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: 60,
  },
  settingCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  settingText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  controlsSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  controlLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  difficultyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceLight,
  },
  difficultyButtonActive: {
    backgroundColor: Colors.accent,
  },
  difficultyText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  difficultyTextActive: {
    color: Colors.text,
  },
  roleRow: {
    gap: Spacing.sm,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  roleButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: Colors.accent,
  },
  roleText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  roleTextActive: {
    color: Colors.text,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationContainer: {
    gap: Spacing.sm,
  },
  bubble: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    maxWidth: '85%',
  },
  bubbleA: {
    backgroundColor: Colors.surfaceLight,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  bubbleB: {
    backgroundColor: Colors.accent + '20',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  speakerLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: 4,
    fontWeight: '600',
  },
  germanText: {
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: '500',
  },
  hiddenText: {
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  englishText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
  tapReveal: {
    fontSize: FontSize.xs,
    color: Colors.accent,
    marginTop: 6,
  },
  completeButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  completeButtonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.success + '15',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
  },
  completedText: {
    fontSize: FontSize.md,
    color: Colors.success,
    fontWeight: '600',
    flex: 1,
  },
  resetLink: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: '600',
  },
});
