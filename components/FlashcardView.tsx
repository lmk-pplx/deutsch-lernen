import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VocabWord } from '../types';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';

interface FlashcardViewProps {
  words: VocabWord[];
  onComplete: (knownIds: string[]) => void;
}

export function FlashcardView({ words, onComplete }: FlashcardViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const currentWord = words[currentIndex];

  const handleFlip = useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  const handleNext = useCallback(
    (known: boolean) => {
      if (known) {
        setKnownIds((prev) => [...prev, currentWord.id]);
      }
      if (currentIndex + 1 >= words.length) {
        const finalKnown = known ? [...knownIds, currentWord.id] : knownIds;
        setFinished(true);
        onComplete(finalKnown);
      } else {
        setCurrentIndex((i) => i + 1);
        setFlipped(false);
      }
    },
    [currentIndex, currentWord, knownIds, words.length, onComplete]
  );

  if (finished) {
    const knownCount = knownIds.length;
    return (
      <View style={styles.container}>
        <View style={styles.resultCard}>
          <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
          <Text style={styles.resultTitle}>Session Complete</Text>
          <Text style={styles.resultText}>
            You knew {knownCount} of {words.length} words
          </Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setCurrentIndex(0);
              setFlipped(false);
              setKnownIds([]);
              setFinished(false);
            }}
          >
            <Text style={styles.resetButtonText}>Review Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        {currentIndex + 1} / {words.length}
      </Text>

      <TouchableOpacity style={styles.card} onPress={handleFlip} activeOpacity={0.9}>
        {!flipped ? (
          <>
            <Text style={styles.cardLabel}>German</Text>
            <Text style={styles.cardText}>{currentWord.german}</Text>
            {currentWord.phonetic && (
              <Text style={styles.phonetic}>[{currentWord.phonetic}]</Text>
            )}
            <Text style={styles.tapHint}>Tap to reveal</Text>
          </>
        ) : (
          <>
            <Text style={styles.cardLabel}>English</Text>
            <Text style={styles.cardTextEnglish}>{currentWord.english}</Text>
            <Text style={styles.exampleLabel}>Example:</Text>
            <Text style={styles.example}>{currentWord.example}</Text>
          </>
        )}
      </TouchableOpacity>

      {flipped && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.learningButton]}
            onPress={() => handleNext(false)}
          >
            <Ionicons name="close-circle" size={24} color={Colors.error} />
            <Text style={[styles.actionText, { color: Colors.error }]}>Still Learning</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.knownButton]}
            onPress={() => handleNext(true)}
          >
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
            <Text style={[styles.actionText, { color: Colors.success }]}>Know It</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    width: width - 48,
    minHeight: 280,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.accent + '30',
  },
  cardLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardText: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.accent,
    textAlign: 'center',
  },
  cardTextEnglish: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  phonetic: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  tapHint: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.lg,
  },
  exampleLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  example: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  learningButton: {
    backgroundColor: Colors.error + '20',
  },
  knownButton: {
    backgroundColor: Colors.success + '20',
  },
  actionText: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  resultTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  resultText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  resetButton: {
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  resetButtonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
});
