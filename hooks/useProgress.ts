import { useState, useEffect, useCallback } from 'react';
import { ProgressData } from '../types';
import { getProgress, recordActivity, recordQuizCompletion, recordWordsLearned } from '../store/progress';

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

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(defaultProgress);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const p = await getProgress();
    setProgress(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logActivity = useCallback(async () => {
    const p = await recordActivity();
    setProgress(p);
  }, []);

  const logQuiz = useCallback(async (correct: number, total: number) => {
    const p = await recordQuizCompletion(correct, total);
    setProgress(p);
  }, []);

  const logWords = useCallback(async (count: number) => {
    const p = await recordWordsLearned(count);
    setProgress(p);
  }, []);

  return { progress, loading, refresh, logActivity, logQuiz, logWords };
}
