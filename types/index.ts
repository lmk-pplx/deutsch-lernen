export type Difficulty = 'A1.1' | 'A1.2' | 'A2.1';

export interface VocabWord {
  id: string;
  german: string;
  english: string;
  example: string;
  phonetic?: string;
}

export interface VocabSet {
  id: string;
  name: string;
  topic: string;
  difficulty: Difficulty;
  words: VocabWord[];
  isCustom?: boolean;
}

export type ViewMode = 'list' | 'flashcard' | 'quiz';

export interface ConversationLine {
  speaker: 'A' | 'B';
  german: string;
  english: string;
}

export interface Conversation {
  id: string;
  title: string;
  titleGerman: string;
  setting: string;
  difficulty: Difficulty;
  topic: string;
  lines: ConversationLine[];
}

export type SpeakingDifficulty = 'easy' | 'medium' | 'hard';

export interface ProgressData {
  lastActivityDate: string | null;
  currentStreak: number;
  longestStreak: number;
  totalWordsLearned: number;
  totalQuizzesCompleted: number;
  totalQuizScore: number;
  totalQuizQuestions: number;
  activityDates: string[];
  flashcardProgress: Record<string, string[]>; // setId -> knownWordIds
}

export interface QuizResult {
  correct: number;
  total: number;
  answers: {
    wordId: string;
    german: string;
    english: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}
