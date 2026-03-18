import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VocabWord, QuizResult } from '../types';
import { Colors, FontSize, Spacing, BorderRadius } from '../constants/theme';

interface QuizViewProps {
  words: VocabWord[];
  onComplete: (result: QuizResult) => void;
}

interface QuizQuestion {
  word: VocabWord;
  options: string[];
  correctAnswer: string;
  direction: 'de-en' | 'en-de';
}

function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(words: VocabWord[]): QuizQuestion[] {
  return shuffle(words).map((word) => {
    const direction: 'de-en' | 'en-de' = Math.random() > 0.5 ? 'de-en' : 'en-de';
    const correctAnswer = direction === 'de-en' ? word.english : word.german;

    const otherWords = words.filter((w) => w.id !== word.id);
    const distractors = shuffle(otherWords)
      .slice(0, 3)
      .map((w) => (direction === 'de-en' ? w.english : w.german));

    const options = shuffle([correctAnswer, ...distractors]);

    return { word, options, correctAnswer, direction };
  });
}

export function QuizView({ words, onComplete }: QuizViewProps) {
  const questions = useMemo(() => generateQuestions(words), [words]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizResult['answers']>([]);
  const [finished, setFinished] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelect = useCallback(
    (answer: string) => {
      if (selectedAnswer !== null) return;
      setSelectedAnswer(answer);

      const isCorrect = answer === currentQ.correctAnswer;
      const newAnswer = {
        wordId: currentQ.word.id,
        german: currentQ.word.german,
        english: currentQ.word.english,
        userAnswer: answer,
        correctAnswer: currentQ.correctAnswer,
        isCorrect,
      };

      setAnswers((prev) => [...prev, newAnswer]);
    },
    [selectedAnswer, currentQ]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      const finalAnswers = answers;
      const correct = finalAnswers.filter((a) => a.isCorrect).length;
      const result: QuizResult = {
        correct,
        total: questions.length,
        answers: finalAnswers,
      };
      setFinished(true);
      onComplete(result);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
    }
  }, [currentIndex, questions.length, answers, onComplete]);

  if (finished) {
    const correct = answers.filter((a) => a.isCorrect).length;
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <ScrollView contentContainerStyle={styles.resultContainer}>
        <View style={styles.scoreCard}>
          <Ionicons
            name={pct >= 70 ? 'trophy' : 'ribbon'}
            size={64}
            color={pct >= 70 ? Colors.warning : Colors.accent}
          />
          <Text style={styles.scoreText}>
            {correct} / {questions.length}
          </Text>
          <Text style={styles.scorePercent}>{pct}%</Text>
        </View>

        {answers.map((a, idx) => (
          <View
            key={idx}
            style={[styles.reviewItem, a.isCorrect ? styles.reviewCorrect : styles.reviewWrong]}
          >
            <View style={styles.reviewHeader}>
              <Ionicons
                name={a.isCorrect ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={a.isCorrect ? Colors.success : Colors.error}
              />
              <Text style={styles.reviewGerman}>{a.german}</Text>
            </View>
            <Text style={styles.reviewEnglish}>{a.english}</Text>
            {!a.isCorrect && (
              <Text style={styles.reviewYourAnswer}>Your answer: {a.userAnswer}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    );
  }

  const questionText =
    currentQ.direction === 'de-en'
      ? currentQ.word.german
      : currentQ.word.english;

  const directionLabel =
    currentQ.direction === 'de-en'
      ? 'What does this mean in English?'
      : 'What is this in German?';

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        Question {currentIndex + 1} of {questions.length}
      </Text>

      <View style={styles.questionCard}>
        <Text style={styles.directionLabel}>{directionLabel}</Text>
        <Text style={styles.questionText}>{questionText}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {currentQ.options.map((option, idx) => {
          let optionStyle = styles.option;
          let textColor = Colors.text;

          if (selectedAnswer !== null) {
            if (option === currentQ.correctAnswer) {
              optionStyle = { ...styles.option, ...styles.optionCorrect };
              textColor = Colors.success;
            } else if (option === selectedAnswer && option !== currentQ.correctAnswer) {
              optionStyle = { ...styles.option, ...styles.optionWrong };
              textColor = Colors.error;
            }
          }

          return (
            <TouchableOpacity
              key={idx}
              style={[styles.option, selectedAnswer !== null && option === currentQ.correctAnswer && styles.optionCorrect, selectedAnswer === option && option !== currentQ.correctAnswer && styles.optionWrong]}
              onPress={() => handleSelect(option)}
              disabled={selectedAnswer !== null}
            >
              <Text style={[styles.optionText, { color: selectedAnswer !== null && option === currentQ.correctAnswer ? Colors.success : selectedAnswer === option && option !== currentQ.correctAnswer ? Colors.error : Colors.text }]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedAnswer !== null && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex + 1 >= questions.length ? 'See Results' : 'Next'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.text} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  progress: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  questionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  directionLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  questionText: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.accent,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: Spacing.sm,
  },
  option: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionCorrect: {
    borderColor: Colors.success,
    backgroundColor: Colors.success + '15',
  },
  optionWrong: {
    borderColor: Colors.error,
    backgroundColor: Colors.error + '15',
  },
  optionText: {
    fontSize: FontSize.lg,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  nextButtonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  resultContainer: {
    padding: Spacing.md,
    paddingBottom: 60,
  },
  scoreCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  scoreText: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  scorePercent: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
  },
  reviewItem: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
  },
  reviewCorrect: {
    borderLeftColor: Colors.success,
  },
  reviewWrong: {
    borderLeftColor: Colors.error,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  reviewGerman: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  reviewEnglish: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginLeft: 28,
  },
  reviewYourAnswer: {
    fontSize: FontSize.sm,
    color: Colors.error,
    marginLeft: 28,
    marginTop: 4,
  },
});
