import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressData } from '../types';

const PROGRESS_KEY = 'deutsch_progress';

const defaultProgress: ProgressData = {
  lastActivityDate: null,
  currentStreak: 0,
  longestStreak: 0,
  totalWordsLearned: 0,
  totalQuizzesCompleted: 0,
  totalQuizScore: 0,
  totalQuizQuestions: 0,
  activityDates: [],
  flashcardProgress: {},
};

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export async function getProgress(): Promise<ProgressData> {
  try {
    const data = await AsyncStorage.getItem(PROGRESS_KEY);
    if (data) {
      return { ...defaultProgress, ...JSON.parse(data) };
    }
    return { ...defaultProgress };
  } catch {
    return { ...defaultProgress };
  }
}

export async function recordActivity(): Promise<ProgressData> {
  const progress = await getProgress();
  const today = getToday();
  const yesterday = getYesterday();

  if (progress.lastActivityDate === today) {
    return progress;
  }

  if (progress.lastActivityDate === yesterday) {
    progress.currentStreak += 1;
  } else if (progress.lastActivityDate !== today) {
    progress.currentStreak = 1;
  }

  if (progress.currentStreak > progress.longestStreak) {
    progress.longestStreak = progress.currentStreak;
  }

  progress.lastActivityDate = today;

  if (!progress.activityDates.includes(today)) {
    progress.activityDates.push(today);
    // Keep last 90 days
    if (progress.activityDates.length > 90) {
      progress.activityDates = progress.activityDates.slice(-90);
    }
  }

  await saveProgress(progress);
  return progress;
}

export async function recordQuizCompletion(correct: number, total: number): Promise<ProgressData> {
  const progress = await recordActivity();
  progress.totalQuizzesCompleted += 1;
  progress.totalQuizScore += correct;
  progress.totalQuizQuestions += total;
  await saveProgress(progress);
  return progress;
}

export async function recordWordsLearned(count: number): Promise<ProgressData> {
  const progress = await recordActivity();
  progress.totalWordsLearned += count;
  await saveProgress(progress);
  return progress;
}

export async function updateFlashcardProgress(setId: string, knownWordIds: string[]): Promise<void> {
  const progress = await getProgress();
  progress.flashcardProgress[setId] = knownWordIds;
  await saveProgress(progress);
}

export async function saveProgress(progress: ProgressData): Promise<void> {
  try {
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

export async function resetProgress(): Promise<void> {
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(defaultProgress));
}
